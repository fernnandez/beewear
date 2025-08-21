import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  async createCheckoutSession(@Body() data: any) {
    return this.stripeService.createCheckoutSession(data);
  }

  // Endpoint para verificar status do pagamento
  @Get('verify-payment/:sessionId')
  async verifyPayment(@Param('sessionId') sessionId: string) {
    try {
      const result = await this.stripeService.verifyPaymentStatus(sessionId);
      return result;
    } catch (error) {
      console.error('❌ Erro ao verificar pagamento:', error);
      throw new BadRequestException(
        'Erro ao verificar pagamento: ' + error.message,
      );
    }
  }
}
