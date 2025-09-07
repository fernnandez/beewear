import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariationService } from '../product/productVariation/product-variation.service';
import { StockService } from '../product/stock/stock.service';
import { User } from '../user/user.entity';

import { PaymentProvider } from 'src/integration/payment/payment.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { MarkAsCanceledDto } from './dto/mark-as-canceled.dto';
import { MarkAsShippedDto } from './dto/mark-as-shipped.dto';
import { OrderItemResponseDto } from './dto/order-item-response.dto';
import { OrderListResponseDto } from './dto/order-list-response.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import {
  ValidateStockItemResponseDto,
  ValidateStockResponseDto,
} from './dto/validate-stock-response.dto';
import { ValidateStockDto } from './dto/validate-stock.dto';
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
    @Inject('PaymentProvider')
    private readonly paymentService: PaymentProvider,
  ) {}

  // SE TIVER COMO CAPTURAR O EVENTO QUE O USER FOI PRO CHECKOUT E NÃO FINALIZOU CHAMAR
  // A FUNÇÃO DE CONFIRMORDER JA FARIA O PEDIDO SER CANCELADO

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

  async findOrdersByUserId(userId: number): Promise<OrderListResponseDto[]> {
    const orders = await this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'user'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => this.mapToListResponseDto(order));
  }

  async findAllOrders(): Promise<OrderListResponseDto[]> {
    const orders = await this.orderRepo.find({
      relations: ['items', 'user'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => this.mapToListResponseDto(order));
  }

  async createOrder(
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    let order: Order | null = null;

    // TODO: usar função do userService não o repo
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Validar estoque antes de criar o pedido
    await this.validateStockForOrderCreation(createOrderDto.items);

    // Reservar estoque imediatamente (remover do estoque disponível)
    await this.reserveStockForOrder(createOrderDto.items);

    // Calcular o total do pedido
    let totalAmount = 0;
    const orderItems: Array<{
      productVariationSizePublicId: string;
      productName: string;
      variationName: string;
      color: string;
      size: string;
      image: string | null;
      quantity: number;
      price: number;
      totalPrice: number;
    }> = [];

    for (const item of createOrderDto.items) {
      const productVariationSize =
        await this.productVariationService.findProductVariationSizeWithRelations(
          item.productVariationSizePublicId,
        );

      if (!productVariationSize) {
        throw new BadRequestException(
          `Produto não encontrado: ${item.productVariationSizePublicId}`,
        );
      }

      const itemPrice = productVariationSize.productVariation.price;
      const itemTotal = itemPrice * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productVariationSizePublicId: item.productVariationSizePublicId,
        productName: productVariationSize.productVariation.product.name,
        variationName: productVariationSize.productVariation.name,
        color: productVariationSize.productVariation.color,
        size: productVariationSize.size.toString(),
        image: productVariationSize.productVariation.images?.[0] || null,
        quantity: item.quantity,
        price: itemPrice,
        totalPrice: itemTotal,
      });
    }

    // Criar o pedido
    order = await this.orderRepo.save({
      user,
      totalAmount,
      shippingCost: 0, // Pode ser ajustado conforme necessário
      shippingAddress: createOrderDto.shippingAddressString,
      status: OrderStatus.PENDING, // Aguardando pagamento
      paymentStatus: 'PENDING', // Aguardando pagamento
    });

    const savedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        return this.orderItemRepo.save({
          order: order!,
          productName: item.productName,
          variationName: item.variationName,
          color: item.color,
          size: item.size,
          image: item.image,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.totalPrice,
          productVariationSizePublicId: item.productVariationSizePublicId,
        });
      }),
    );

    order.items = savedOrderItems;

    console.log(
      '✅ Pedido criado com sucesso, estoque reservado, aguardando pagamento:',
      order.id,
    );

    return this.mapToResponseDto(order);
  }

  async confirmOrder(
    userId: number,
    orderPublicId: string,
    sessionId: string,
  ): Promise<OrderResponseDto> {
    try {
      // Verificar sessão do Stripe
      const stripeSession =
        await this.paymentService.verifyPaymentStatus(sessionId);

      if (!stripeSession.success) {
        throw new Error('Erro ao verificar sessão do Stripe');
      }

      console.log(JSON.stringify(stripeSession, null, 2));

      const pendingOrder = await this.orderRepo.findOne({
        where: { publicId: orderPublicId, user: { id: userId } },
        relations: ['items'], // Carregar os itens do pedido para atualizar estoque
      });

      if (!pendingOrder) {
        throw new NotFoundException('Pedido não encontrado');
      }

      // Extrair paymentIntentId da sessão para salvar na entidade
      const paymentIntentId = stripeSession.paymentIntentId;
      if (!paymentIntentId) {
        throw new Error('PaymentIntent ID não encontrado na sessão');
      }

      if (this.isPaymentSuccessful(stripeSession)) {
        return await this.processSuccessfulPayment(
          pendingOrder,
          paymentIntentId,
          stripeSession,
        );
      } else {
        return await this.processFailedPayment(pendingOrder, paymentIntentId);
      }
    } catch (error) {
      console.error('❌ Erro ao confirmar pedido:', error);
      throw error;
    }
  }

  private isPaymentSuccessful(stripeSession: any): boolean {
    return (
      stripeSession.paymentStatus === 'paid' &&
      stripeSession.status === 'complete'
    );
  }

  private async processSuccessfulPayment(
    order: Order,
    paymentIntentId: string,
    stripeSession: any,
  ): Promise<OrderResponseDto> {
    order.status = OrderStatus.CONFIRMED;
    order.paymentStatus = 'PAID';
    order.paymentMethodType = stripeSession.paymentDetails?.method || 'unknown';
    order.paymentIntentId = paymentIntentId;

    const confirmedOrder = await this.orderRepo.save(order);

    // O estoque já foi reservado no createOrder, não precisa atualizar novamente
    console.log(
      '✅ Pedido confirmado com sucesso - Estoque já estava reservado',
    );

    return this.mapToResponseDto(confirmedOrder);
  }

  private async processFailedPayment(
    order: Order,
    paymentIntentId: string,
  ): Promise<OrderResponseDto> {
    order.status = OrderStatus.CANCELLED;
    order.paymentStatus = 'FAILED';
    order.notes = `Pedido cancelado - Pagamento rejeitado. PaymentIntent: ${paymentIntentId}`;

    const cancelledOrder = await this.orderRepo.save(order);

    // Devolver estoque após cancelamento do pagamento
    try {
      await this.restoreStockAfterCancellation(cancelledOrder.items);
      console.log(
        '✅ Estoque devolvido com sucesso após cancelamento do pagamento',
      );
    } catch (stockError) {
      console.error(
        '❌ Erro ao devolver estoque após cancelamento:',
        stockError,
      );
      // Não re-throw para não impedir o cancelamento do pedido
      // O estoque pode ser devolvido manualmente depois
    }

    return this.mapToResponseDto(cancelledOrder);
  }

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

      if (!stockItem) {
        throw new BadRequestException(
          `Produto não encontrado: ${item.productVariationSizePublicId}`,
        );
      }

      const availableQuantity = stockItem.quantity;
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

  /**
   * Valida estoque antes de criar o pedido para evitar inconsistências
   * @param items Itens do pedido
   */
  private async validateStockForOrderCreation(items: any[]): Promise<void> {
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
            `Produto não encontrado: ${item.productVariationSizePublicId}`,
          );
        }

        if (stockItem.quantity < item.quantity) {
          throw new BadRequestException(
            `Estoque insuficiente para o item ${item.productVariationSizePublicId}. Disponível: ${stockItem.quantity}, Solicitado: ${item.quantity}`,
          );
        }

        console.log(
          `✅ Estoque validado para ${item.productVariationSizePublicId}: ${stockItem.quantity} disponível`,
        );
      } catch (error) {
        console.error(
          `❌ Erro na validação de estoque para ${item.productVariationSizePublicId}:`,
          error,
        );
        throw error; // Re-throw para impedir a criação do pedido
      }
    }

    console.log('✅ Estoque validado com sucesso para todos os itens');
  }

  /**
   * Reserva o estoque para os itens do pedido
   * @param items Array de itens contendo productVariationSizePublicId e quantidade
   * @returns Array com os itens reservados (publicId e quantidade)
   * @throws BadRequestException se o item não for encontrado ou estoque insuficiente
   */
  private async reserveStockForOrder(
    items: Array<{ productVariationSizePublicId: string; quantity: number }>,
  ): Promise<Array<{ publicId: string; quantity: number }>> {
    const reservedItems: Array<{ publicId: string; quantity: number }> = [];

    for (const item of items) {
      if (!item.productVariationSizePublicId) {
        console.warn(
          '⚠️ Item sem productVariationSizePublicId, pulando reserva de estoque',
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
            `Item de estoque não encontrado para reserva: ${item.productVariationSizePublicId}`,
          );
        }

        if (stockItem.quantity < item.quantity) {
          throw new BadRequestException(
            `Estoque insuficiente para reserva: ${item.productVariationSizePublicId}. Disponível: ${stockItem.quantity}, Solicitado: ${item.quantity}`,
          );
        }

        await this.stockService.adjustStock(
          stockItem.publicId,
          -item.quantity, // Quantidade negativa para saída
          `Reserva - Pedido criado - ${item.productVariationSizePublicId}`,
        );

        reservedItems.push({
          publicId: stockItem.publicId,
          quantity: item.quantity,
        });
        console.log(
          `✅ Estoque reservado para ${item.productVariationSizePublicId}: -${item.quantity} unidades`,
        );
      } catch (error) {
        console.error(
          `❌ Erro ao reservar estoque para ${item.productVariationSizePublicId}:`,
          error,
        );

        throw error; // Re-throw para interromper a criação do pedido
      }
    }
    return reservedItems;
  }

  async updateOrderStatus(
    publicId: string,
    updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    const order = await this.findOrderByPublicIdOrFail(publicId);

    // Validar transição de status
    this.validateStatusTransition(order.status, updateStatusDto.status);

    // Atualizar status e notas
    return this.updateOrderStatusInternal(
      order,
      updateStatusDto.status,
      updateStatusDto.notes,
    );
  }

  async markAsShipped(
    publicId: string,
    markAsShippedDto: MarkAsShippedDto,
  ): Promise<OrderResponseDto> {
    const order = await this.findOrderByPublicIdOrFail(publicId);

    // Validar transição de status (CONFIRMED -> SHIPPED)
    this.validateStatusTransition(order.status, OrderStatus.SHIPPED);

    // Atualizar status e notas
    return this.updateOrderStatusInternal(
      order,
      OrderStatus.SHIPPED,
      markAsShippedDto.notes,
    );
  }

  async markAsCanceled(
    publicId: string,
    markAsCanceledDto: MarkAsCanceledDto,
  ): Promise<OrderResponseDto> {
    const order = await this.findOrderByPublicIdOrFail(publicId);

    // Validar transição de status (qualquer status -> CANCELLED, exceto DELIVERED)
    this.validateStatusTransition(order.status, OrderStatus.CANCELLED);

    // Restaurar estoque antes de cancelar (não falhar se não conseguir)
    try {
      await this.restoreStockAfterCancellation(order.items);
    } catch (error) {
      console.warn(
        '⚠️ Não foi possível restaurar o estoque, mas o cancelamento continuará:',
        error,
      );
    }

    // Atualizar status e notas
    return this.updateOrderStatusInternal(
      order,
      OrderStatus.CANCELLED,
      markAsCanceledDto.notes,
    );
  }

  /**
   * Busca um pedido por publicId ou falha com NotFoundException
   */
  private async findOrderByPublicIdOrFail(publicId: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { publicId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  private async updateOrderStatusInternal(
    order: Order,
    newStatus: OrderStatus,
    notes?: string,
  ): Promise<OrderResponseDto> {
    const previousStatus = order.status;

    // Atualizar status e notas
    order.status = newStatus;
    if (notes) {
      order.notes = notes;
    }

    // Salvar alterações
    const updatedOrder = await this.orderRepo.save(order);

    console.log(
      `✅ Status do pedido ${order.publicId} atualizado de ${previousStatus} para ${newStatus}`,
    );

    return this.mapToResponseDto(updatedOrder);
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ): void {
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [], // Status final
      [OrderStatus.CANCELLED]: [], // Status final
    };

    const allowedNextStatuses = allowedTransitions[currentStatus];

    if (!allowedNextStatuses.includes(newStatus)) {
      throw new BadRequestException(
        `Transição de status inválida: não é possível alterar de ${currentStatus} para ${newStatus}. ` +
          `Status permitidos: ${allowedNextStatuses.join(', ')}`,
      );
    }
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
        // Primeiro, encontrar o StockItem pelo ProductVariationSize
        const stockItem =
          await this.stockService.findStockItemByProductVariationSize(
            item.productVariationSizePublicId,
          );

        if (!stockItem) {
          console.warn(
            `⚠️ StockItem não encontrado para ProductVariationSize ${item.productVariationSizePublicId}`,
          );
          continue;
        }

        await this.stockService.adjustStock(
          stockItem.publicId,
          item.quantity, // Quantidade positiva para entrada
          `Cancelamento - Pedido cancelado - ${item.productName} (${item.variationName}, ${item.size})`,
        );

        console.log(
          `✅ Estoque restaurado para ${item.productName}: +${item.quantity} unidades`,
        );
      } catch (error) {
        console.warn(
          `⚠️ Erro ao restaurar estoque para item ${item.productName}:`,
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
      paymentIntentId: order.paymentIntentId,
      totalAmount: Number(order.totalAmount),
      shippingCost: Number(order.shippingCost),
      shippingAddress: order.shippingAddress,
      paymentMethodType: order.paymentMethodType,
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
      paymentIntentId: order.paymentIntentId,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      totalItems,
      paymentMethodType: order.paymentMethodType,
      paymentStatus: order.paymentStatus,
      user: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
      },
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
