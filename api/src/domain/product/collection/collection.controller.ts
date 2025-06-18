import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './create-collection.dto';

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
    description: 'Single collection by PublicId',
    type: Collection,
  })
  async findOne(@Param('publicId') publicId: string) {
    return this.collectionSerivce.findOne(publicId);
  }
}
