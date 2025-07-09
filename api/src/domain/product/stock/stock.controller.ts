import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { StockMovement } from './stock-movement.entity';
import { StockService } from './stock.service';

@ApiTags('Stock')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post(':stockItemPublicId/adjust')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza ajuste de estoque manual' })
  @ApiParam({
    name: 'stockItemPublicId',
    type: String,
    description: 'PublicId do item de estoque a ser ajustado',
  })
  @ApiResponse({
    status: 200,
    description: 'Ajuste de estoque realizado com sucesso',
  })
  async adjustStock(
    @Param('stockItemPublicId') stockItemPublicId: string,
    @Body() dto: AdjustStockDto,
  ) {
    const result = await this.stockService.adjustStock(
      stockItemPublicId,
      dto.quantity,
      dto.description,
    );

    return {
      message: 'Ajuste de estoque realizado com sucesso',
      data: result,
    };
  }

  @Get(':stockItemPublicId/movements')
  @ApiOperation({
    summary: 'Listar movimentações de estoque',
    description:
      'Retorna o histórico de movimentações (entradas e saídas) para um item de estoque específico.',
  })
  @ApiParam({
    name: 'stockItemPublicId',
    description: 'Identificador público do item de estoque',
    type: String,
    example: 'fca2455a-dde3-4e8e-a0a4-20342d55ad3a',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de movimentações retornada com sucesso',
    type: StockMovement,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Item de estoque não encontrado',
  })
  async listStockMovements(
    @Param('stockItemPublicId') stockItemPublicId: string,
  ): Promise<StockMovement[]> {
    const movements =
      await this.stockService.listStockMovements(stockItemPublicId);

    return movements;
  }
}
