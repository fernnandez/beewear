import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { RemoveProductVariationImageDto } from './dto/remove-product-variation-image.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { UpdateProductVariationImagesDto } from './dto/update-product-variation-images.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
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

  @Patch('variation/:publicId/images')
  @ApiOperation({ summary: 'Adiciona imagens à variação do produto' })
  @ApiParam({
    name: 'publicId',
    description: 'PublicId da variação do produto',
  })
  @ApiResponse({ status: 200, description: 'Imagens adicionadas com sucesso' })
  @ApiResponse({ status: 404, description: 'Variação não encontrada' })
  async updateVariationImages(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateProductVariationImagesDto,
  ) {
    await this.productService.updateProductVariationImages(publicId, dto);

    return {
      message: 'Imagens adicionadas com sucesso',
    };
  }

  @Patch('variation/:publicId/images/remove')
  @ApiOperation({ summary: 'Remove uma imagem da variação do produto' })
  @ApiParam({
    name: 'publicId',
    description: 'PublicId da variação do produto',
  })
  @ApiResponse({ status: 200, description: 'Imagem removida com sucesso' })
  @ApiResponse({
    status: 404,
    description: 'Imagem ou variação não encontrada',
  })
  async removeVariationImage(
    @Param('publicId') publicId: string,
    @Body() dto: RemoveProductVariationImageDto,
  ) {
    await this.productService.removeProductVariationImage(publicId, dto.image);

    return {
      message: 'Imagem removida com sucesso',
    };
  }
  s;
}
