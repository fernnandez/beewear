import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly service: StockService) {}

  @Post()
  create(@Body() body: { productId: string; quantity: number }) {
    return this.service.createInitialStock(body.productId, body.quantity);
  }

  @Get('movements/:productId')
  getMovements(@Param('productId') productId: string) {
    return this.service.getMovementsByProduct(productId);
  }
}
