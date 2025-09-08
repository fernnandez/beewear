import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';
import { OrderStatus } from './enums/order-status.enum';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@Injectable()
export class OrderCleanupService {
  private readonly logger = new Logger(OrderCleanupService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly orderService: OrderService,
  ) {}

  /**
   * Cron job que executa a cada minuto para cancelar pedidos abandonados
   * Cancela pedidos pendentes criados há mais de 5 minutos
   */
  @Cron('0 */10 * * * *', {
    name: 'cancel-abandoned-orders',
  })
  async cancelAbandonedOrders(): Promise<void> {
    this.logger.log('Iniciando limpeza de pedidos abandonados...');
    try {
      // Usar timestamp Unix para evitar problemas de timezone
      const now = DateTime.now();
      const fiveMinutesAgoTimestamp = now.minus({ minutes: 5 }).toMillis();

      this.logger.log(`Data atual (UTC): ${now.toISO()}`);
      this.logger.log(`Timestamp limite: ${fiveMinutesAgoTimestamp}`);

      // Buscar todos os pedidos pendentes
      const allPendingOrders = await this.orderRepository.find({
        where: { status: OrderStatus.PENDING },
        relations: ['items'],
      });

      this.logger.log(
        `Total de pedidos pendentes encontrados: ${allPendingOrders.length}`,
      );

      // Filtrar pedidos usando timestamp Unix (mais confiável)
      const abandonedOrders = allPendingOrders.filter((order) => {
        const orderTimestamp = DateTime.fromJSDate(order.createdAt).toMillis();
        const ageInMinutes = (now.toMillis() - orderTimestamp) / (1000 * 60);

        this.logger.log(
          `Pedido ${order.publicId}: timestamp ${orderTimestamp}, idade: ${Math.floor(ageInMinutes)} minutos`,
        );

        return ageInMinutes > 5;
      });

      if (abandonedOrders.length === 0) {
        this.logger.log('Nenhum pedido abandonado encontrado');
        return;
      }

      this.logger.log(
        `Encontrados ${abandonedOrders.length} pedidos abandonados para cancelar`,
      );

      let cancelledCount = 0;

      for (const order of abandonedOrders) {
        try {
          // Usar o método markAsCanceled do OrderService que já tem toda a lógica implementada
          await this.orderService.markAsCanceled(order.publicId, {
            notes: `Pedido cancelado automaticamente por abandono de sessão em ${now.toISO()}`,
          });

          cancelledCount++;
          this.logger.log(`Pedido ${order.publicId} cancelado com sucesso`);
        } catch (error) {
          this.logger.error(
            `Erro ao cancelar pedido ${order.publicId}:`,
            error.message,
          );
        }
      }

      this.logger.log(
        `Limpeza concluída: ${cancelledCount}/${abandonedOrders.length} pedidos cancelados`,
      );
    } catch (error) {
      this.logger.error(
        'Erro durante a limpeza de pedidos abandonados:',
        error,
      );
    }
  }
}
