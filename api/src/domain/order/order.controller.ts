import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import {
  ConfirmOrderDto,
  CreateOrderDto,
  OrderListResponseDto,
  OrderResponseDto,
  ValidateStockDto,
  ValidateStockResponseDto,
} from './dto';
import { OrderService } from './order.service';

import { Public } from '../../infra/auth/decorator/public.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('my-orders')
  async findOrdersByUserId(
    @Request() req: any,
  ): Promise<OrderListResponseDto[]> {
    return this.orderService.findOrdersByUserId(req.user.id);
  }

  @Get(':publicId')
  @Public()
  async findOrderByPublicId(
    @Param('publicId') publicId: string,
  ): Promise<OrderResponseDto> {
    return this.orderService.findOrderByPublicId(publicId);
  }

  // SE O USER NÃO FINALIZAR O CHECKOUT O QUE ACONTECE?
  // como cancelar o pedido?
  // buscar todos os pedidos pendentes criados a pelo menos 1 hora e cancelar

  @Post()
  async createOrder(
    @Request() req: any,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.createOrder(req.user.id, createOrderDto);
  }

  @Post('confirm/:publicId')
  async confirmOrder(
    @Request() req: any,
    @Param('publicId') publicId: string,
    @Body() confirmOrderDto: ConfirmOrderDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.confirmOrder(
      req.user.id,
      publicId,
      confirmOrderDto.sessionId,
    );
  }

  // TODO: mover isso pro contexto de product
  @Post('validate-stock')
  async validateStock(
    @Body() validateStockDto: ValidateStockDto,
  ): Promise<ValidateStockResponseDto> {
    return this.orderService.validateStockBeforeCheckout(validateStockDto);
  }
}
