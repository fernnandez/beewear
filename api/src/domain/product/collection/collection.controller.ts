import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
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
}
