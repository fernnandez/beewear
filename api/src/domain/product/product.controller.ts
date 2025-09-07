import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { StockDashboardDto } from './dto/stock-dashboard.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductQueryDto } from '../../shared/dto/product-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/pagination.dto';
import { ProductFilterDto } from '../../shared/dto/filter.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';

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

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos',
    type: [Product],
  })
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('paginated')
  @ApiOperation({
    summary: 'Listar produtos com paginação, filtros e ordenação',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de produtos',
    type: PaginatedResponseDto,
  })
  async findAllPaginated(@Query() query: ProductQueryDto) {
    // Convert ProductQueryDto to separate PaginationDto and ProductFilterDto
    const pagination: PaginationDto = {
      page: query.page,
      limit: query.limit,
    };

    const filters: ProductFilterDto = {
      search: query.search,
      active:
        query.active === 'true'
          ? true
          : query.active === 'false'
            ? false
            : undefined,
      collectionId: query.collectionId,
    };

    return this.productService.findAllPaginated(pagination, filters, {
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
  }

  @Get(':publicId')
  @ApiOperation({ summary: 'Buscar produto por PublicId' })
  @ApiParam({
    name: 'publicId',
    description: 'PublicId do produto',
  })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado com sucesso',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findOne(@Param('publicId') publicId: string): Promise<Product> {
    return this.productService.getProductDetailsByPublicId(publicId);
  }

  @Patch(':publicId/status')
  @ApiOperation({ summary: 'Atualiza o status de um produto (ativo/inativo)' })
  @ApiParam({ name: 'publicId', type: String })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  async updateStatus(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateProductStatusDto,
  ) {
    const product = await this.productService.updateStatus(
      publicId,
      dto.isActive,
    );
    return {
      message: 'Status da coleção atualizado com sucesso',
      data: product,
    };
  }

  @Patch(':publicId')
  @ApiOperation({ summary: 'Atualiza os dados do produto' })
  @ApiParam({ name: 'publicId', type: String, required: true })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async update(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateProductDto,
  ) {
    const product = await this.productService.update(publicId, dto);

    return {
      message: 'Produto atualizado com sucesso',
      data: product,
    };
  }

  @Get('dashboard/stock')
  async getStockDashboard(): Promise<StockDashboardDto> {
    return this.productService.getStockDashboard();
  }

  @Delete(':publicId')
  async delete(@Param('publicId') publicId: string) {
    await this.productService.delete(publicId);

    return {
      message: 'Produto excluido com sucesso',
    };
  }
}
