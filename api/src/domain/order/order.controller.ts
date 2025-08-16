import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import {
  OrderListResponseDto,
  OrderResponseDto,
  UpdateOrderStatusDto,
  ValidateStockDto,
  ValidateStockResponseDto,
} from './dto';
import { OrderService } from './order.service';

import { Public } from '../../infra/auth/decorator/public.decorator';
import { Roles } from '../../infra/auth/decorator/roles.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('validate-stock')
  async validateStock(
    @Request() req,
    @Body() validateStockDto: ValidateStockDto,
  ): Promise<ValidateStockResponseDto> {
    return this.orderService.validateStockBeforeCheckout(validateStockDto);
  }

  @Get('my-orders')
  async findUserOrders(@Request() req): Promise<OrderListResponseDto[]> {
    return this.orderService.findUserOrders(req.user.id);
  }

  @Get(':publicId')
  @Public()
  async findOrderByPublicId(
    @Param('publicId') publicId: string,
  ): Promise<OrderResponseDto> {
    return this.orderService.findOrderByPublicId(publicId);
  }

  @Put(':publicId/status')
  @Roles('ADMIN')
  async updateOrderStatus(
    @Param('publicId') publicId: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.updateOrderStatus(publicId, updateDto);
  }
}
