import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';
import { CollectionDetailsDto } from './dto/collection-details.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionImageDto } from './dto/update-collection-image.dto';
import { UpdateCollectionStatusDto } from './dto/update-collection-status.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Public } from 'src/infra/auth/decorator/public.decorator';

@ApiBearerAuth('access-token')
@ApiTags('Collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  @Public()
  @ApiOkResponse({
    description: 'List of collections',
    type: Collection,
    isArray: true,
  })
  async findAll() {
    return this.collectionService.findAll();
  }

  @Get(':publicId')
  @ApiParam({
    name: 'publicId',
    required: true,
    description: 'UUID da coleção',
  })
  @ApiOkResponse({
    description: 'Collection Details by PublicId',
    type: CollectionDetailsDto,
  })
  getCollectionDetails(
    @Param('publicId') publicId: string,
  ): Promise<CollectionDetailsDto> {
    return this.collectionService.getCollectionDetailsByPublicId(publicId);
  }

  @Post()
  @ApiCreatedResponse({ description: 'collection successfully registered' })
  async create(@Body() dto: CreateCollectionDto) {
    return this.collectionService.create(dto);
  }

  @Patch(':publicId/status')
  @ApiOperation({ summary: 'Atualiza o status de uma coleção (ativa/inativa)' })
  @ApiParam({ name: 'publicId', type: String })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  async updateStatus(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateCollectionStatusDto,
  ) {
    const collection = await this.collectionService.updateStatus(
      publicId,
      dto.isActive,
    );
    return {
      message: 'Status da coleção atualizado com sucesso',
      data: collection,
    };
  }

  @Patch(':publicId')
  @ApiOperation({ summary: 'Atualiza os dados da coleção' })
  @ApiParam({ name: 'publicId', type: String, required: true })
  @ApiResponse({ status: 200, description: 'Coleção atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Coleção não encontrada' })
  async update(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateCollectionDto,
  ) {
    const collection = await this.collectionService.update(publicId, dto);

    return {
      message: 'Coleção atualizada com sucesso',
      data: collection,
    };
  }

  @Patch(':publicId/image')
  @ApiOperation({ summary: 'Atualiza imagem da coleção' })
  @ApiParam({
    name: 'publicId',
    description: 'PublicId da variação do produto',
  })
  @ApiResponse({ status: 200, description: 'Imagem atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Coleção não encontrada' })
  async updateVariationImages(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateCollectionImageDto,
  ) {
    await this.collectionService.updateCollectionImage(publicId, dto);

    return {
      message: 'Imagem atualizada com sucesso',
    };
  }

  @Delete(':publicId')
  @ApiOperation({ summary: 'Exclui uma coleção' })
  @ApiParam({ name: 'publicId', type: String, required: true })
  @ApiResponse({ status: 200, description: 'Coleção excluida com sucesso' })
  @ApiResponse({ status: 404, description: 'Coleção nao encontrada' })
  async delete(@Param('publicId') publicId: string) {
    await this.collectionService.delete(publicId);

    return {
      message: 'Coleção excluida com sucesso',
    };
  }
}
