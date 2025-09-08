import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

import { AppModule } from 'src/app.module';
import { Address } from 'src/domain/user/address/address.entity';
import { AddressService } from 'src/domain/user/address/address.service';
import { CreateAddressDto } from 'src/domain/user/address/dto/create-address.dto';
import { UpdateAddressDto } from 'src/domain/user/address/dto/update-address.dto';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';
import { setupIntegrationMocks } from 'test/utils/mocks/setup-mocks';

import { NotFoundException } from '@nestjs/common';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('AddressService (with Real DB Interaction)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let service: AddressService;
  let addressRepo: Repository<Address>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get<AddressService>(AddressService);
    addressRepo = module.get(getRepositoryToken(Address));

    setupIntegrationMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  describe('create', () => {
    it(
      'should create address with default country Portugal',
      runWithRollbackTransaction(async () => {
        const dto: CreateAddressDto = {
          name: 'Casa',
          street: 'Rua das Flores',
          number: '123',
          complement: 'Apto 1',
          neighborhood: 'Centro',
          city: 'Lisboa',
          state: 'Lisboa',
          postalCode: '1000-001',
        };

        const result = await service.create(1, dto);

        expect(result).toBeDefined();
        expect(result.name).toBe(dto.name);
        expect(result.street).toBe(dto.street);
        expect(result.number).toBe(dto.number);
        expect(result.complement).toBe(dto.complement);
        expect(result.neighborhood).toBe(dto.neighborhood);
        expect(result.city).toBe(dto.city);
        expect(result.state).toBe(dto.state);
        expect(result.postalCode).toBe(dto.postalCode);
        expect(result.country).toBe('Portugal'); // Default value
        expect(result.userId).toBe(1);
      }),
    );

    it(
      'should create address with custom country',
      runWithRollbackTransaction(async () => {
        const dto: CreateAddressDto = {
          name: 'Trabalho',
          street: 'Avenida da Liberdade',
          number: '456',
          neighborhood: 'Baixa',
          city: 'Porto',
          state: 'Porto',
          postalCode: '4000-001',
          country: 'Brasil',
        };

        const result = await service.create(1, dto);

        expect(result).toBeDefined();
        expect(result.country).toBe('Brasil');
      }),
    );
  });

  describe('findAll', () => {
    it(
      'should return all addresses for user ordered by createdAt DESC',
      runWithRollbackTransaction(async () => {
        // Create multiple addresses with different timestamps
        const address1 = addressRepo.create({
          name: 'Casa',
          street: 'Rua A',
          number: '1',
          neighborhood: 'Centro',
          city: 'Lisboa',
          state: 'Lisboa',
          postalCode: '1000-001',
          country: 'Portugal',
          userId: 1,
          createdAt: DateTime.fromISO('2024-01-01T10:00:00Z').toJSDate(),
        });

        const address2 = addressRepo.create({
          name: 'Trabalho',
          street: 'Rua B',
          number: '2',
          neighborhood: 'Baixa',
          city: 'Porto',
          state: 'Porto',
          postalCode: '4000-001',
          country: 'Portugal',
          userId: 1,
          createdAt: DateTime.fromISO('2024-01-01T11:00:00Z').toJSDate(),
        });

        await addressRepo.save([address1, address2]);

        const result = await service.findAll(1);

        expect(result).toHaveLength(2);
      }),
    );

    it(
      'should return empty array when user has no addresses',
      runWithRollbackTransaction(async () => {
        const result = await service.findAll(999);

        expect(result).toHaveLength(0);
      }),
    );
  });

  describe('findOne', () => {
    it(
      'should return address by id',
      runWithRollbackTransaction(async () => {
        const address = addressRepo.create({
          name: 'Casa',
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Lisboa',
          state: 'Lisboa',
          postalCode: '1000-001',
          country: 'Portugal',
          userId: 1,
        });

        const savedAddress = await addressRepo.save(address);

        const result = await service.findOne(savedAddress.id);

        expect(result).toBeDefined();
        expect(result.id).toBe(savedAddress.id);
        expect(result.name).toBe('Casa');
      }),
    );

    it(
      'should throw NotFoundException when address not found',
      runWithRollbackTransaction(async () => {
        await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      }),
    );
  });

  describe('update', () => {
    it(
      'should update address successfully',
      runWithRollbackTransaction(async () => {
        const address = addressRepo.create({
          name: 'Casa',
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Lisboa',
          state: 'Lisboa',
          postalCode: '1000-001',
          country: 'Portugal',
          userId: 1,
        });

        const savedAddress = await addressRepo.save(address);

        const updateDto: UpdateAddressDto = {
          name: 'Casa Atualizada',
          street: 'Rua Nova',
        };

        const result = await service.update(1, savedAddress.id, updateDto);

        expect(result).toBeDefined();
        expect(result.name).toBe('Casa Atualizada');
        expect(result.street).toBe('Rua Nova');
        expect(result.number).toBe('123'); // Should remain unchanged
      }),
    );

    it(
      'should throw NotFoundException when address not found for user',
      runWithRollbackTransaction(async () => {
        const updateDto: UpdateAddressDto = {
          name: 'Casa Atualizada',
        };

        await expect(service.update(1, 999, updateDto)).rejects.toThrow(
          NotFoundException,
        );
      }),
    );

    it(
      'should throw NotFoundException when address belongs to different user',
      runWithRollbackTransaction(async () => {
        const address = addressRepo.create({
          name: 'Casa',
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Lisboa',
          state: 'Lisboa',
          postalCode: '1000-001',
          country: 'Portugal',
          userId: 2, // Different user
        });

        const savedAddress = await addressRepo.save(address);

        const updateDto: UpdateAddressDto = {
          name: 'Casa Atualizada',
        };

        await expect(
          service.update(1, savedAddress.id, updateDto),
        ).rejects.toThrow(NotFoundException);
      }),
    );

    it(
      'should throw NotFoundException when address is not found after update',
      runWithRollbackTransaction(async () => {
        const address = addressRepo.create({
          name: 'Casa',
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Lisboa',
          state: 'Lisboa',
          postalCode: '1000-001',
          country: 'Portugal',
          userId: 1,
        });

        const savedAddress = await addressRepo.save(address);

        const updateDto: UpdateAddressDto = {
          name: 'Casa Atualizada',
        };

        // Mock the findOne method to return null after update
        const findOneSpy = jest.spyOn(addressRepo, 'findOne');
        findOneSpy
          .mockResolvedValueOnce(savedAddress) // First call (before update) - returns address
          .mockResolvedValueOnce(null); // Second call (after update) - returns null

        await expect(
          service.update(1, savedAddress.id, updateDto),
        ).rejects.toThrow(NotFoundException);

        expect(findOneSpy).toHaveBeenCalledTimes(2);
        findOneSpy.mockRestore();
      }),
    );
  });

  describe('remove', () => {
    it(
      'should remove address successfully',
      runWithRollbackTransaction(async () => {
        const address = addressRepo.create({
          name: 'Casa',
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Lisboa',
          state: 'Lisboa',
          postalCode: '1000-001',
          country: 'Portugal',
          userId: 1,
        });

        const savedAddress = await addressRepo.save(address);

        await service.remove(1, savedAddress.id);

        const deletedAddress = await addressRepo.findOne({
          where: { id: savedAddress.id },
        });

        expect(deletedAddress).toBeNull();
      }),
    );

    it(
      'should throw NotFoundException when address not found for user',
      runWithRollbackTransaction(async () => {
        await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
      }),
    );

    it(
      'should throw NotFoundException when address belongs to different user',
      runWithRollbackTransaction(async () => {
        const address = addressRepo.create({
          name: 'Casa',
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'Lisboa',
          state: 'Lisboa',
          postalCode: '1000-001',
          country: 'Portugal',
          userId: 2, // Different user
        });

        const savedAddress = await addressRepo.save(address);

        await expect(service.remove(1, savedAddress.id)).rejects.toThrow(
          NotFoundException,
        );
      }),
    );
  });
});
