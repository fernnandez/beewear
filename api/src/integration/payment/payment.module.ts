import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Module({
  providers: [
    StripeService,
    {
      provide: 'PaymentProvider',
      useClass: StripeService,
    },
  ],
  exports: [StripeService, 'PaymentProvider'],
})
export class PaymentModule {}
