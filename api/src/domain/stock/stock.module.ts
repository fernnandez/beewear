import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockItem } from './stock-item.entity';
import { StockMovement } from './stock-movement.entity';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockItem, StockMovement])],
  providers: [StockService],
  controllers: [StockController],
})
export class StockModule {}
