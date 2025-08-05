import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductDetailsResponseDto } from './dto/product-details-response.dto';
import { ProductListResponseDto } from './dto/product-list-response.dto';
import { ProductService } from './product.service';
import { Public } from 'src/infra/auth/decorator/public.decorator';

@Controller('public/product')
@ApiTags('Public Product')
export class PublicProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar produtos ativos para o frontend' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos otimizada para frontend',
    type: [ProductListResponseDto],
  })
  async findAll(): Promise<ProductListResponseDto[]> {
    return this.productService.findAllForFrontend();
  }

  @Get(':publicId')
  @Public()
  @ApiOperation({ summary: 'Buscar detalhes do produto para o frontend' })
  @ApiParam({ name: 'publicId', description: 'PublicId do produto' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do produto otimizados para frontend',
    type: ProductDetailsResponseDto,
  })
  async findOne(
    @Param('publicId') publicId: string,
  ): Promise<ProductDetailsResponseDto> {
    return this.productService.getProductDetailsForFrontend(publicId);
  }
}
