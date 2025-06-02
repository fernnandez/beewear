import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async createInitialStock(productId: string, quantity: number) {
    const existing = await this.stockRepo.findOneBy({ productId });
    if (existing) throw new Error('Estoque já registrado para este produto');

    const stock = this.stockRepo.create({ productId, quantity });
    await this.stockRepo.save(stock);

    await this.movementRepo.save({
      productId,
      type: 'IN',
      quantity,
      description: 'Estoque inicial',
    });

    return stock;
  }

  async getByProductId(productId: string): Promise<StockItem | null> {
    return this.stockRepo.findOneBy({ productId });
  }

  async increase(productId: string, quantity: number, description?: string) {
    const stock = await this.getByProductId(productId);
    if (!stock) throw new Error('Produto sem estoque');

    stock.quantity += quantity;
    await this.stockRepo.save(stock);

    await this.movementRepo.save({
      productId,
      type: 'IN',
      quantity,
      description: description || 'Entrada de estoque',
    });

    return stock;
  }

  async decrease(productId: string, quantity: number, description?: string) {
    const stock = await this.getByProductId(productId);
    if (!stock) throw new Error('Produto sem estoque');

    if (stock.quantity < quantity) {
      throw new Error('Estoque insuficiente');
    }

    stock.quantity -= quantity;
    await this.stockRepo.save(stock);

    await this.movementRepo.save({
      productId,
      type: 'OUT',
      quantity,
      description: description || 'Saída de estoque',
    });

    return stock;
  }

  async getMovementsByProduct(productId: string) {
    const stockItem = await this.stockRepo.findOneBy({ productId });
    if (!stockItem) throw new Error('Estoque não encontrado');

    return this.movementRepo.find({
      where: { stockItemId: stockItem.id },
      order: { createdAt: 'DESC' },
      relations: ['stockItem', 'stockItem.product'],
    });
  }
}
