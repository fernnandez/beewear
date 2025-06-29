import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './collection.entity';
import { CollectionDetailsDto } from './dto/collection-details.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

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

  async getCollectionDetailsByPublicId(
    publicId: string,
  ): Promise<CollectionDetailsDto> {
    const collection = await this.collectionRepo.findOne({
      where: { publicId },
      relations: {
        products: {
          variations: {
            sizes: {
              stock: true,
            },
          },
        },
      },
    });

    if (!collection) {
      throw new NotFoundException('Coleção não encontrada');
    }

    let totalProducts = 0;
    let totalStock = 0;
    let totalValue = 0;

    const products = collection.products.map((product) => {
      const variations = product.variations.map((variation) => {
        const quantity = 0;
        const value = quantity * Number(variation.price);

        totalProducts += 1;
        totalStock += quantity;
        totalValue += value;

        return {
          publicId: variation.publicId,
          color: variation.color,
          size: 'S',
          price: Number(variation.price),
          stock: quantity,
        };
      });

      return {
        publicId: product.publicId,
        name: product.name,
        imageUrl: product.imageUrl,
        active: product.active,
        variations,
      };
    });

    return {
      publicId: collection.publicId,
      name: collection.name,
      description: collection.description,
      imageUrl: collection.imageUrl,
      active: collection.active,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
      aggregations: {
        totalProducts,
        totalStock,
        totalValue,
      },
      products,
    };
  }

  async updateStatus(publicId: string, isActive: boolean): Promise<Collection> {
    const collection = await this.collectionRepo.findOneBy({ publicId });
    if (!collection) throw new NotFoundException('Coleção não encontrada');

    collection.active = isActive;
    return this.collectionRepo.save(collection);
  }

  async update(
    publicId: string,
    dto: UpdateCollectionDto,
  ): Promise<Collection> {
    const collection = await this.collectionRepo.findOneBy({ publicId });

    if (!collection) throw new NotFoundException('Coleção não encontrada');

    this.collectionRepo.merge(collection, dto);
    return this.collectionRepo.save(collection);
  }
}
