import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { PaymentProvider } from 'src/integration/payment/payment.interface';

@Controller('payments')
export class PaymentController {
  constructor(
    @Inject('PaymentProvider')
    private readonly paymentService: PaymentProvider,
  ) {}

  @Post('checkout')
  async createCheckoutSession(@Body() data: any) {
    return this.paymentService.createCheckoutSession(data);
  }

  // Endpoint para verificar status do pagamento
  @Get('verify-payment/:paymentIntentId')
  async verifyPayment(@Param('paymentIntentId') paymentIntentId: string) {
    try {
      const result =
        await this.paymentService.verifyPaymentStatus(paymentIntentId);
      return result;
    } catch (error) {
      console.error('❌ Erro ao verificar pagamento:', error);
      throw new BadRequestException(
        'Erro ao verificar pagamento: ' +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  }
}
