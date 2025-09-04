import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';

import { OrderService } from './order.service';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../infra/auth/decorator/public.decorator';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderListResponseDto } from './dto/order-list-response.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { MarkAsShippedDto } from './dto/mark-as-shipped.dto';
import { ValidateStockResponseDto } from './dto/validate-stock-response.dto';
import { ValidateStockDto } from './dto/validate-stock.dto';

@ApiBearerAuth('access-token')
@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('my-orders')
  async findOrdersByUserId(
    @Request() req: any,
  ): Promise<OrderListResponseDto[]> {
    return this.orderService.findOrdersByUserId(req.user.id);
  }

  @Get()
  async findAllOrders(): Promise<OrderListResponseDto[]> {
    return this.orderService.findAllOrders();
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
  @HttpCode(200)
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

  @Patch(':publicId/status')
  @ApiOperation({ summary: 'Atualiza o status de um pedido' })
  @ApiParam({
    name: 'publicId',
    type: String,
    description: 'ID público do pedido',
  })
  @ApiResponse({
    status: 200,
    description: 'Status do pedido atualizado com sucesso',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Transição de status inválida' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async updateOrderStatus(
    @Param('publicId') publicId: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.updateOrderStatus(publicId, updateStatusDto);
  }

  @Post(':publicId/mark-as-shipped')
  @HttpCode(200)
  @ApiOperation({ summary: 'Marca um pedido como enviado' })
  @ApiParam({
    name: 'publicId',
    type: String,
    description: 'ID público do pedido',
  })
  @ApiResponse({
    status: 200,
    description: 'Pedido marcado como enviado com sucesso',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Transição de status inválida ou observações obrigatórias',
  })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async markAsShipped(
    @Param('publicId') publicId: string,
    @Body() markAsShippedDto: MarkAsShippedDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.markAsShipped(publicId, markAsShippedDto);
  }

  // TODO: mover isso pro contexto de product
  @Post('validate-stock')
  async validateStock(
    @Body() validateStockDto: ValidateStockDto,
  ): Promise<ValidateStockResponseDto> {
    return this.orderService.validateStockBeforeCheckout(validateStockDto);
  }
}
