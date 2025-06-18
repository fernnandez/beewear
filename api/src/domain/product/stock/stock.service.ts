import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariation } from '../productVariation/product-variation.entity';
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
    productVariation: ProductVariation,
    quantity: number,
  ) {
    const existing = await this.stockRepo.findOneBy({ productVariation });
    if (existing) throw new Error('Estoque já registrado para este produto');

    const stockItem = await this.stockRepo.save({ productVariation, quantity });

    Logger.log(
      `Criando estoque inicial ${productVariation.product.name}-${productVariation.id}`,
    );

    await this.movementRepo.save({
      stockItem,
      type: 'IN',
      quantity,
      description: 'Estoque inicial',
    });

    return stockItem;
  }

  // async increase(productId: string, quantity: number, description?: string) {
  //   const stock = await this.getByProductId(productId);
  //   if (!stock) throw new Error('Produto sem estoque');

  //   stock.quantity += quantity;
  //   await this.stockRepo.save(stock);

  //   await this.movementRepo.save({
  //     productId,
  //     type: 'IN',
  //     quantity,
  //     description: description || 'Entrada de estoque',
  //   });

  //   return stock;
  // }

  // async decrease(productId: string, quantity: number, description?: string) {
  //   const stock = await this.getByProductId(productId);
  //   if (!stock) throw new Error('Produto sem estoque');

  //   if (stock.quantity < quantity) {
  //     throw new Error('Estoque insuficiente');
  //   }

  //   stock.quantity -= quantity;
  //   await this.stockRepo.save(stock);

  //   await this.movementRepo.save({
  //     productId,
  //     type: 'OUT',
  //     quantity,
  //     description: description || 'Saída de estoque',
  //   });

  //   return stock;
  // }

  // async getMovementsByProduct(productId: string) {
  //   const stockItem = await this.stockRepo.findOneBy({ productId });
  //   if (!stockItem) throw new Error('Estoque não encontrado');

  //   return this.movementRepo.find({
  //     where: { stockItemId: stockItem.id },
  //     order: { createdAt: 'DESC' },
  //     relations: ['stockItem', 'stockItem.product'],
  //   });
  // }
}
