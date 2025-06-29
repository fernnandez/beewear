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

  // @Get()
  // @ApiOperation({ summary: 'Listar todos os produtos' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Lista de produtos',
  //   type: [Product],
  // })
  // async findAll(): Promise<Product[]> {
  //   return this.productService.findAll();
  // }

  // @Get(':publicId')
  // @ApiOperation({ summary: 'Buscar produto por PublicId' })
  // @ApiParam({
  //   name: 'publicId',
  //   type: Number,
  //   description: 'PublicId do produto',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Produto encontrado com sucesso',
  //   type: Product,
  // })
  // @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  // async findOne(@Param('publicId') publicId: string): Promise<Product> {
  //   return this.productService.getProductDetailsByPublicId(publicId);
  // }
}
