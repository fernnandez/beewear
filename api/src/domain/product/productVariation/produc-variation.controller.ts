import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from '../product.service';
import { CreateProductVariationDto } from './dto/create-product-variation.dto';
import { RemoveProductVariationImageDto } from './dto/remove-product-variation-image.dto';
import { UpdateProductVariationImagesDto } from './dto/update-product-variation-images.dto';
import { UpdateProductVariationDto } from './dto/update-product-variation.dto';
import { ProductVariation } from './product-variation.entity';
import { ProductVariationService } from './product-variation.service';

@ApiBearerAuth('access-token')
@ApiTags('Product Variation')
@Controller('product-variation')
export class ProductVariationController {
  constructor(
    private readonly productService: ProductService,
    private readonly productVariationService: ProductVariationService,
  ) {}

  @Post(':productPublicId')
  @ApiOperation({
    summary: 'Cadastra uma nova variação para um produto existente',
  })
  @ApiParam({
    name: 'productPublicId',
    description: 'PublicId do produto ao qual a variação será adicionada',
    type: String,
  })
  @ApiCreatedResponse({
    description: 'Variação cadastrada com sucesso',
    type: ProductVariation,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async createVariation(
    @Param('productPublicId') productPublicId: string,
    @Body() dto: CreateProductVariationDto,
  ) {
    const product =
      await this.productService.getProductDetailsByPublicId(productPublicId);

    console.log(product);

    const newVariation =
      await this.productVariationService.createProductVariation(product, dto);

    return {
      message: 'Variação cadastrada com sucesso',
      data: newVariation,
    };
  }

  @Delete(':publicId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma variação de produto pelo PublicId' })
  @ApiParam({
    name: 'publicId',
    description: 'PublicId da variação do produto a ser removida',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Variação removida com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Variação não encontrada.',
  })
  async deleteVariation(@Param('publicId') publicId: string): Promise<void> {
    await this.productVariationService.deleteProductVariation(publicId);
  }

  @Patch(':publicId')
  @ApiOperation({ summary: 'Atualiza os dados de uma variação de produto' })
  @ApiParam({
    name: 'publicId',
    description: 'PublicId da variação do produto a ser atualizada',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Variação atualizada com sucesso',
    type: ProductVariation,
  })
  @ApiResponse({ status: 404, description: 'Variação não encontrada' })
  async updateVariation(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateProductVariationDto,
  ) {
    const updatedVariation =
      await this.productVariationService.updateProductVariation(publicId, dto);
    return {
      message: 'Variação atualizada com sucesso',
      data: updatedVariation,
    };
  }

  @Patch(':publicId/images')
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
    await this.productVariationService.updateProductVariationImages(
      publicId,
      dto,
    );

    return {
      message: 'Imagens adicionadas com sucesso',
    };
  }

  @Patch(':publicId/images/remove')
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
    await this.productVariationService.removeProductVariationImage(
      publicId,
      dto.image,
    );

    return {
      message: 'Imagem removida com sucesso',
    };
  }
}
