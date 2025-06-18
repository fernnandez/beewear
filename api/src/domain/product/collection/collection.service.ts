import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './collection.entity';
import { CreateCollectionDto } from './create-collection.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepo: Repository<Collection>,
  ) {}

  async create(dto: CreateCollectionDto): Promise<Collection> {
    return await this.collectionRepo.save(dto);
  }

  async findAll(): Promise<Collection[]> {
    return this.collectionRepo.find();
  }

  async findOne(publicId: string): Promise<Collection> {
    try {
      return await this.collectionRepo.findOneOrFail({ where: { publicId } });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException('Coleção não encontrada');
    }
  }
}
