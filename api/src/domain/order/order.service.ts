import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariationService } from '../product/productVariation/product-variation.service';
import { StockService } from '../product/stock/stock.service';
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
    private readonly productVariationService: ProductVariationService,
    private readonly stockService: StockService,
  ) {}

  async validateStockBeforeCheckout(
    validateStockDto: ValidateStockDto,
  ): Promise<ValidateStockResponseDto> {
    const stockItems: ValidateStockItemResponseDto[] = [];
    let totalAmount = 0;
    let isValid = true;

    for (const item of validateStockDto.items) {
      // Buscar ProductVariationSize com suas relações usando o serviço
      const productVariationSize =
        await this.productVariationService.findProductVariationSizeWithRelations(
          item.productVariationSizePublicId,
        );

      if (!productVariationSize) {
        throw new BadRequestException(
          `Produto não encontrado: ${item.productVariationSizePublicId}`,
        );
      }

      // Buscar estoque usando o serviço
      const stockItem =
        await this.stockService.findStockItemByProductVariationSize(
          item.productVariationSizePublicId,
        );

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

      // ✅ VALIDAR ESTOQUE ANTES DE CRIAR O PEDIDO
      await this.validateStockForPayment(paymentData.items);

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
          // ✅ Buscar informações adicionais do produto usando o serviço
          let productVariationSize: any = null;
          let productVariation: any = null;
          let product: any = null;

          if (item.productVariationSizePublicId) {
            try {
              productVariationSize =
                await this.productVariationService.findProductVariationSizeWithRelations(
                  item.productVariationSizePublicId,
                );

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

      // ✅ ATUALIZAR ESTOQUE APÓS CRIAR O PEDIDO
      try {
        await this.updateStockAfterOrderCreation(orderItems);
        console.log(
          '✅ Estoque atualizado com sucesso para todos os itens do pedido',
        );
      } catch (stockError) {
        console.error(
          '❌ Erro ao atualizar estoque, mas pedido foi criado:',
          stockError,
        );
        // ✅ Não re-throw aqui para não impedir a criação do pedido
        // O estoque pode ser atualizado manualmente depois
      }

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

    // Se o pedido foi cancelado, devolver os itens ao estoque
    if (order.status === OrderStatus.CANCELLED) {
      await this.restoreStockAfterCancellation(order.items);
    }
  }

  /**
   * Atualiza o estoque removendo as quantidades dos itens vendidos
   * @param orderItems Itens do pedido criado
   */
  private async updateStockAfterOrderCreation(
    orderItems: OrderItem[],
  ): Promise<void> {
    console.log('🔄 Atualizando estoque após criação do pedido...');

    for (const item of orderItems) {
      if (!item.productVariationSizePublicId) {
        console.warn(
          '⚠️ Item sem productVariationSizePublicId, pulando atualização de estoque',
        );
        continue;
      }

      try {
        // Buscar o item de estoque usando o serviço
        const stockItem =
          await this.stockService.findStockItemByProductVariationSize(
            item.productVariationSizePublicId,
          );

        if (!stockItem) {
          console.warn(
            `⚠️ Item de estoque não encontrado para: ${item.productVariationSizePublicId}`,
          );
          continue;
        }

        // Verificar se há estoque suficiente
        if (stockItem.quantity < item.quantity) {
          throw new BadRequestException(
            `Estoque insuficiente para o item ${item.productName}. Disponível: ${stockItem.quantity}, Solicitado: ${item.quantity}`,
          );
        }

        // Atualizar estoque usando o StockService
        await this.stockService.adjustStock(
          stockItem.publicId,
          -item.quantity, // Quantidade negativa para saída
          `Venda - Pedido criado - ${item.productName} (${item.variationName}, ${item.size})`,
        );

        console.log(
          `✅ Estoque atualizado para ${item.productName}: -${item.quantity} unidades`,
        );
      } catch (error) {
        console.error(
          `❌ Erro ao atualizar estoque para item ${item.productName}:`,
          error,
        );
        throw error; // Re-throw para interromper a criação do pedido
      }
    }

    console.log(
      '✅ Estoque atualizado com sucesso para todos os itens do pedido',
    );
  }

  /**
   * Restaura o estoque quando um pedido é cancelado
   * @param orderItems Itens do pedido cancelado
   */
  private async restoreStockAfterCancellation(
    orderItems: OrderItem[],
  ): Promise<void> {
    console.log('🔄 Restaurando estoque após cancelamento do pedido...');

    for (const item of orderItems) {
      if (!item.productVariationSizePublicId) {
        continue;
      }

      try {
        const stockItem =
          await this.stockService.findStockItemByProductVariationSize(
            item.productVariationSizePublicId,
          );

        if (stockItem) {
          await this.stockService.adjustStock(
            stockItem.publicId,
            item.quantity, // Quantidade positiva para entrada
            `Cancelamento - Pedido cancelado - ${item.productName} (${item.variationName}, ${item.size})`,
          );

          console.log(
            `✅ Estoque restaurado para ${item.productName}: +${item.quantity} unidades`,
          );
        }
      } catch (error) {
        console.error(
          `❌ Erro ao restaurar estoque para item ${item.productName}:`,
          error,
        );
        // Não re-throw aqui para não impedir o cancelamento do pedido
      }
    }

    console.log(
      '✅ Estoque restaurado com sucesso para todos os itens do pedido cancelado',
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

  /**
   * Valida estoque antes de criar o pedido para evitar inconsistências
   * @param items Itens do pedido
   */
  private async validateStockForPayment(items: any[]): Promise<void> {
    console.log('🔄 Validando estoque antes de criar pedido...');

    for (const item of items) {
      if (!item.productVariationSizePublicId) {
        console.warn(
          '⚠️ Item sem productVariationSizePublicId, pulando validação',
        );
        continue;
      }

      try {
        const stockItem =
          await this.stockService.findStockItemByProductVariationSize(
            item.productVariationSizePublicId,
          );

        if (!stockItem) {
          throw new BadRequestException(
            `Item de estoque não encontrado para: ${item.productVariationSizePublicId}`,
          );
        }

        if (stockItem.quantity < item.quantity) {
          throw new BadRequestException(
            `Estoque insuficiente para o item ${item.name}. Disponível: ${stockItem.quantity}, Solicitado: ${item.quantity}`,
          );
        }

        console.log(
          `✅ Estoque validado para ${item.name}: ${stockItem.quantity} disponível`,
        );
      } catch (error) {
        console.error(
          `❌ Erro na validação de estoque para ${item.name}:`,
          error,
        );
        throw error; // Re-throw para impedir a criação do pedido
      }
    }

    console.log('✅ Estoque validado com sucesso para todos os itens');
  }
}
