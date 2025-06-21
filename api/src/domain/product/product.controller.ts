import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { ProductService } from './product.service';

@ApiBearerAuth('access-token')
@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiCreatedResponse({ description: 'product successfully registered' })
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }
}
