import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductDetailsResponseDto } from './dto/product-details-response.dto';
import { ProductListResponseDto } from './dto/product-list-response.dto';
import { ProductService } from './product.service';
import { Public } from 'src/infra/auth/decorator/public.decorator';
import { ProductQueryDto } from '../../shared/dto/product-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/pagination.dto';

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

  @Get('paginated')
  @Public()
  @ApiOperation({ summary: 'Listar produtos com paginação e filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de produtos com filtros',
    type: PaginatedResponseDto<ProductListResponseDto>,
  })
  async findAllPaginated(
    @Query() query: ProductQueryDto,
  ): Promise<PaginatedResponseDto<ProductListResponseDto>> {
    // Separar parâmetros de paginação e filtros
    const { page, limit, ...filters } = query;

    // Processar arrays de cores e tamanhos
    const processedFilters = {
      ...filters,
      colors: filters.colors ? filters.colors.split(',') : undefined,
      sizes: filters.sizes ? filters.sizes.split(',') : undefined,
    };

    return this.productService.findAllPaginated(
      { page, limit },
      processedFilters,
    );
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
