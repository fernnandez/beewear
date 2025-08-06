import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user.service';
import { Address } from './address.entity';
import { AddressResponseDto } from './dto/address-response.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepo: Repository<Address>,
    private userService: UserService,
  ) {}

  async create(
    userId: number,
    dto: CreateAddressDto,
  ): Promise<AddressResponseDto> {
    const user = await this.userService.findOneOrFail(userId);

    const address = this.addressRepo.create({
      ...dto,
      user,
      country: dto.country || 'Portugal',
    });

    const savedAddress = await this.addressRepo.save(address);
    return this.mapToResponseDto(savedAddress);
  }

  async findAll(userId: number): Promise<AddressResponseDto[]> {
    const addresses = await this.addressRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return addresses.map((address) => this.mapToResponseDto(address));
  }

  async findOne(id: number): Promise<AddressResponseDto> {
    const address = await this.addressRepo.findOne({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    return this.mapToResponseDto(address);
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateAddressDto,
  ): Promise<AddressResponseDto> {
    const address = await this.addressRepo.findOne({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    await this.addressRepo.update(id, dto);

    const updatedAddress = await this.addressRepo.findOne({
      where: { id, userId },
    });

    if (!updatedAddress) {
      throw new NotFoundException('Endereço não encontrado após atualização');
    }

    return this.mapToResponseDto(updatedAddress);
  }

  async remove(userId: number, id: number): Promise<void> {
    const address = await this.addressRepo.findOne({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    await this.addressRepo.delete(id);
  }

  private mapToResponseDto(address: Address): AddressResponseDto {
    return {
      id: address.id,
      name: address.name,
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      userId: address.userId,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }
}
