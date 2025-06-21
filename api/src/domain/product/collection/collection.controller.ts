import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionDetailsDto } from './dto/collection-details.dto';

@ApiBearerAuth('access-token')
@ApiTags('Collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionSerivce: CollectionService) {}

  @Post()
  @ApiCreatedResponse({ description: 'collection successfully registered' })
  async create(@Body() dto: CreateCollectionDto) {
    return this.collectionSerivce.create(dto);
  }

  @Get()
  @ApiOkResponse({
    description: 'List of collections',
    type: Collection,
    isArray: true,
  })
  async findAll() {
    return this.collectionSerivce.findAll();
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
    return this.collectionSerivce.getCollectionDetailsByPublicId(publicId);
  }
}
