import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  async createCheckoutSession(@Body() data: any) {
    return this.stripeService.createCheckoutSession(data);
  }

  @Get('session/:sessionId')
  async getSession(@Param('sessionId') sessionId: string) {
    return this.stripeService.retrieveSession(sessionId);
  }

  @Get('payment-methods')
  async getAvailablePaymentMethods() {
    return this.stripeService.getAvailablePaymentMethods();
  }

  // Endpoint para verificar status do pagamento
  @Get('verify-payment/:sessionId')
  async verifyPayment(@Req() req: any, @Param('sessionId') sessionId: string) {
    try {
      const userId = req.user.userId;

      if (!userId) {
        throw new BadRequestException('Usuário não autenticado');
      }

      const result = await this.stripeService.verifyPaymentStatus(
        userId,
        sessionId,
      );
      return result;
    } catch (error) {
      console.error('❌ Erro ao verificar pagamento:', error);
      throw new BadRequestException(
        'Erro ao verificar pagamento: ' + error.message,
      );
    }
  }
}
