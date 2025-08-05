import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './collection.entity';
import { CollectionDetailsDto } from './dto/collection-details.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionImageDto } from './dto/update-collection-image.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionListResponseDto } from './dto/collection-list-response.dto';

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

  async findOneOrFail(publicId: string): Promise<Collection> {
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

    collection.products.map((product) => {
      const variations = product.variations.map((variation) => {
        const sizes = variation.sizes.map((sizeRelation) => {
          const stockQty = sizeRelation.stock.quantity;
          totalStock += stockQty;
          totalValue += stockQty * Number(variation.price);

          return {
            size: sizeRelation.size, // supondo que `size` seja string ou enum
            stock: stockQty,
          };
        });

        totalProducts += 1;

        return {
          publicId: variation.publicId,
          color: variation.color,
          price: Number(variation.price),
          stock: sizes.reduce((acc, s) => acc + s.stock, 0),
          sizes,
        };
      });

      return {
        publicId: product.publicId,
        name: product.name,
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
    };
  }

  async updateStatus(publicId: string, isActive: boolean): Promise<Collection> {
    const collection = await this.findOneOrFail(publicId);

    collection.active = isActive;
    return this.collectionRepo.save(collection);
  }

  async update(
    publicId: string,
    dto: UpdateCollectionDto,
  ): Promise<Collection> {
    const collection = await this.findOneOrFail(publicId);

    this.collectionRepo.merge(collection, dto);
    return this.collectionRepo.save(collection);
  }

  async delete(publicId: string): Promise<void> {
    const collection = await this.findOneOrFail(publicId);
    await this.collectionRepo.remove(collection);
  }

  async updateCollectionImage(
    collectionPublicId: string,
    dto: UpdateCollectionImageDto,
  ) {
    const collection = await this.findOneOrFail(collectionPublicId);

    collection.imageUrl = dto.image;
    await this.collectionRepo.save(collection);
  }

  // Método para o frontend
  async findAllActiveForFrontend(): Promise<CollectionListResponseDto[]> {
    const collections = await this.collectionRepo.find({
      where: { active: true },
    });

    return collections.map(collection => ({
      publicId: collection.publicId,
      name: collection.name,
      active: collection.active,
      description: collection.description,
      imageUrl: collection.imageUrl,
    }));
  }
}
