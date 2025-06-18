import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionDto } from './create-collection.dto';
import { Collection } from './collection.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepo: Repository<Collection>,
  ) {}

  async create(dto: CreateCollectionDto) {
    await this.collectionRepo.save(dto);
  }
}
