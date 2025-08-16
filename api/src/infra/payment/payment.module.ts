import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { OrderModule } from 'src/domain/order/order.module';

@Module({
  imports: [OrderModule], // ✅ Adicionar OrderModule
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService], // ✅ Exportar para uso em outros módulos
})
export class PaymentModule {}
