import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariationSize } from '../product/productVariation/product-variation-size.entity';
import { StockItem } from '../product/stock/stock-item.entity';
import { User } from '../user/user.entity';
import {
  OrderItemResponseDto,
  OrderListResponseDto,
  OrderResponseDto,
  UpdateOrderStatusDto,
  ValidateStockDto,
  ValidateStockItemResponseDto,
  ValidateStockResponseDto,
} from './dto';
import { OrderStatus } from './enums/order-status.enum';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ProductVariationSize)
    private readonly productVariationSizeRepo: Repository<ProductVariationSize>,
    @InjectRepository(StockItem)
    private readonly stockItemRepo: Repository<StockItem>,
  ) {}

  async validateStockBeforeCheckout(
    validateStockDto: ValidateStockDto,
  ): Promise<ValidateStockResponseDto> {
    const stockItems: ValidateStockItemResponseDto[] = [];
    let totalAmount = 0;
    let isValid = true;

    for (const item of validateStockDto.items) {
      // Buscar ProductVariationSize com suas relações
      const productVariationSize = await this.productVariationSizeRepo.findOne({
        where: { publicId: item.productVariationSizePublicId },
        relations: ['productVariation', 'productVariation.product'],
      });

      if (!productVariationSize) {
        throw new BadRequestException(
          `Produto não encontrado: ${item.productVariationSizePublicId}`,
        );
      }

      // Buscar estoque
      const stockItem = await this.stockItemRepo.findOne({
        where: {
          productVariationSize: {
            publicId: item.productVariationSizePublicId,
          },
        },
      });

      const availableQuantity = stockItem?.quantity || 0;
      const isItemAvailable = availableQuantity >= item.quantity;
      const itemPrice = productVariationSize.productVariation.price;
      const itemTotal = itemPrice * item.quantity;

      if (!isItemAvailable) {
        isValid = false;
      }

      stockItems.push({
        productVariationSizePublicId: item.productVariationSizePublicId,
        productName: productVariationSize.productVariation.product.name,
        variationName: productVariationSize.productVariation.name,
        size: productVariationSize.size.toString(),
        color: productVariationSize.productVariation.color,
        requestedQuantity: item.quantity,
        availableQuantity,
        isAvailable: isItemAvailable,
        price: itemPrice,
      });

      totalAmount += itemTotal;
    }

    return {
      isValid,
      items: stockItems,
      totalAmount,
      message: isValid
        ? 'Estoque disponível para todos os itens'
        : 'Alguns itens não possuem estoque suficiente',
    };
  }

  async createOrderFromPayment(paymentData: any): Promise<OrderResponseDto> {
    try {
      const user = await this.userRepo.findOne({
        where: { id: paymentData.userId },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const order = await this.orderRepo.save({
        user,
        totalAmount: paymentData.totalAmount,
        paymentMethodType: 'CREDIT_CARD',
        paymentMethodName: 'Stripe',
        status: OrderStatus.CONFIRMED,
        paymentStatus: 'PAID',
        stripeSessionId: paymentData.stripeSessionId,
        shippingAddress: paymentData.shippingAddress,
      });

      const orderItems = await Promise.all(
        paymentData.items.map(async (item: any) => {
          // ✅ Buscar informações adicionais do produto usando o productVariationSizePublicId
          let productVariationSize: any = null;
          let productVariation: any = null;
          let product: any = null;

          if (item.productVariationSizePublicId) {
            try {
              productVariationSize =
                await this.productVariationSizeRepo.findOne({
                  where: { publicId: item.productVariationSizePublicId },
                  relations: ['productVariation', 'productVariation.product'],
                });

              if (productVariationSize) {
                productVariation = productVariationSize.productVariation;
                product = productVariation.product;
              }
            } catch (error) {
              console.log('⚠️ Erro ao buscar dados do produto:', error);
            }
          }

          return this.orderItemRepo.save({
            order,
            productName: item.name,
            variationName: productVariation?.name || 'Variação não encontrada',
            color: productVariation?.color || 'Cor não especificada',
            size:
              productVariationSize?.size?.toString() ||
              'Tamanho não especificado',
            image: item.images?.[0] || null,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
            // ✅ Salvar identificadores para referência futura
            productVariationSizePublicId: item.productVariationSizePublicId,
            productVariationPublicId: productVariation?.publicId || null,
            productPublicId: product?.publicId || null,
          });
        }),
      );

      order.items = orderItems;

      console.log('✅ Pedido criado com sucesso:', order.id);

      return this.mapToResponseDto(order);
    } catch (error) {
      console.error('❌ Erro ao criar pedido a partir de pagamento:', error);
      throw error;
    }
  }

  async findOrderByPublicId(publicId: string): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { publicId },
      relations: ['items', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return this.mapToResponseDto(order);
  }

  async findOrderByStripeSession(
    stripeSessionId: string,
  ): Promise<Order | null> {
    const order = await this.orderRepo.findOne({
      where: { stripeSessionId },
    });

    return order || null;
  }

  async findUserOrders(userId: number): Promise<OrderListResponseDto[]> {
    const orders = await this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => this.mapToListResponseDto(order));
  }

  async updateOrderStatus(
    publicId: string,
    updateDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { publicId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    this.validateStatusTransition(order.status, updateDto.status);

    order.status = updateDto.status;
    if (updateDto.notes) {
      order.notes = updateDto.notes;
    }

    const updatedOrder = await this.orderRepo.save(order);

    await this.handleStockUpdate(updatedOrder);

    return this.mapToResponseDto(updatedOrder);
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    const allowedTransitions = validTransitions[currentStatus];
    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Transição de status inválida: ${currentStatus} → ${newStatus}`,
      );
    }
  }

  private async handleStockUpdate(order: Order): Promise<void> {
    console.log(
      `Atualizando estoque para pedido ${order.publicId} com status ${order.status}`,
    );
  }

  private mapToResponseDto(order: Order): OrderResponseDto {
    return {
      publicId: order.publicId,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      shippingCost: Number(order.shippingCost),
      shippingAddress: order.shippingAddress,
      paymentMethodType: order.paymentMethodType,
      paymentMethodName: order.paymentMethodName,
      paymentStatus: order.paymentStatus,
      notes: order.notes,
      items: order.items.map((item) => this.mapToItemResponseDto(item)),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  private mapToListResponseDto(order: Order): OrderListResponseDto {
    const totalItems = order.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    return {
      publicId: order.publicId,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      totalItems,
      paymentMethodType: order.paymentMethodType,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  private mapToItemResponseDto(item: OrderItem): OrderItemResponseDto {
    return {
      id: item.id,
      productName: item.productName,
      variationName: item.variationName,
      color: item.color,
      size: item.size,
      image: item.image,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
      productVariationSizePublicId: item.productVariationSizePublicId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
