import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariationSize } from '../productVariation/product-variation-size.entity';
import { StockItem } from './stock-item.entity';
import { StockMovement } from './stock-movement.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockItem)
    private readonly stockRepo: Repository<StockItem>,

    @InjectRepository(StockMovement)
    private readonly movementRepo: Repository<StockMovement>,
  ) {}

  async createInitialStock(
    productVariationSize: ProductVariationSize,
    quantity: number,
  ) {
    const existing = await this.stockRepo.findOne({
      where: {
        productVariationSize: { id: productVariationSize.id },
      },
      relations: ['productVariationSize'],
    });

    if (existing) throw new Error('Estoque já registrado para este produto');

    const stockItem = await this.stockRepo.save({
      productVariationSize,
      quantity,
    });

    Logger.log(
      `Criando estoque inicial ${productVariationSize.productVariation.name}-${productVariationSize.id}`,
    );

    await this.movementRepo.save({
      stockItem,
      type: 'IN',
      quantity,
      description: 'Estoque inicial',
      previousQuantity: 0,
      newQuantity: quantity,
    });

    return stockItem;
  }

  async adjustStock(
    stockItemPublicId: string,
    adjustmentQuantity: number,
    customDescription?: string,
  ) {
    const stockItem = await this.stockRepo.findOne({
      where: { publicId: stockItemPublicId },
      relations: [
        'productVariationSize',
        'productVariationSize.productVariation',
      ],
    });

    if (!stockItem) {
      throw new NotFoundException('Estoque não encontrado');
    }

    const previousQuantity = stockItem.quantity;
    const newQuantity = previousQuantity + adjustmentQuantity;

    if (newQuantity < 0) {
      throw new BadRequestException(
        'Estoque insuficiente para realizar esta saída',
      );
    }

    const type = adjustmentQuantity >= 0 ? 'IN' : 'OUT';
    const description =
      customDescription ||
      (type === 'IN' ? 'Entrada de estoque' : 'Saída de estoque');

    stockItem.quantity = newQuantity;
    await this.stockRepo.save(stockItem);

    await this.movementRepo.save({
      stockItem,
      type,
      quantity: Math.abs(adjustmentQuantity),
      description,
      previousQuantity,
      newQuantity,
    });

    Logger.log(
      `Ajuste de estoque ${type} para ${stockItem.productVariationSize.productVariation.name}-${stockItem.productVariationSize.id} (${stockItem.publicId}): ${adjustmentQuantity}`,
    );

    return stockItem;
  }

  async listStockMovements(stockItemPublicId: string) {
    const movements = await this.movementRepo.find({
      where: { stockItem: { publicId: stockItemPublicId } },
      order: { createdAt: 'DESC' },
    });

    return movements;
  }
}
