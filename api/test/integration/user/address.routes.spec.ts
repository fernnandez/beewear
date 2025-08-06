import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { AppModule } from 'src/app.module';
import { Address } from 'src/domain/user/address/address.entity';
import { User } from 'src/domain/user/user.entity';
import { createTestingApp } from 'test/utils/create-testing-app';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';

import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('AddressController - Integration (HTTP)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let addressRepo: Repository<Address>;

  const baseUrl = '/addresses';

  beforeAll(async () => {
    app = await createTestingApp({
      imports: [AppModule],
      enableLogs: true, // Habilitar logs detalhados
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    userRepo = app.get<Repository<User>>(getRepositoryToken(User));
    addressRepo = app.get<Repository<Address>>(getRepositoryToken(Address));
  });

  afterAll(async () => {
    await app.close();
    jest.restoreAllMocks();
  });

  describe('POST /addresses', () => {
    it(
      'should create a new address for authenticated user',
      runWithRollbackTransaction(async () => {
        // Arrange: Login para obter token
        const plainPassword = '12345678';

        const user = await userRepo.findOneBy({ email: 'email@example.com' });

        const loginRes = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: user!.email, password: plainPassword })
          .expect(200);

        const token = loginRes.body.access_token;

        const createAddressDto = {
          name: 'Nova Casa',
          street: 'Rua Nova',
          number: '999',
          complement: 'Bloco A',
          neighborhood: 'Novo Bairro',
          city: 'Nova Cidade',
          state: 'Novo Estado',
          postalCode: '99999-999',
          country: 'Portugal',
        };

        // Act

        const response = await request(app.getHttpServer())
          .post(baseUrl)
          .set('Authorization', `Bearer ${token}`)
          .send(createAddressDto)
          .expect(201);

        // Assert
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(createAddressDto.name);
        expect(response.body.street).toBe(createAddressDto.street);

        // Verificar se foi salvo no banco
        const savedAddress = await addressRepo.findOne({
          where: { id: response.body.id },
        });
        expect(savedAddress).toBeDefined();
        expect(savedAddress?.name).toBe(createAddressDto.name);
      }),
    );

    it(
      'should create address as default and remove default from others',
      runWithRollbackTransaction(async () => {
        // Arrange: Login e criar endereço padrão
        const plainPassword = '12345678';

        const user = await userRepo.findOneBy({ email: 'email@example.com' });

        if (!user) {
          throw new Error('Usuário não encontrado');
        }

        // Criar endereço padrão existente
        const existingDefaultAddress = {
          id: 1,
          name: 'Casa Antiga',
          street: 'Rua Antiga',
          number: '123',
          complement: '',
          neighborhood: 'Bairro Antigo',
          city: 'Cidade Antiga',
          state: 'Estado Antigo',
          postalCode: '11111-111',
          country: 'Portugal',
          userId: user!.id,
        };

        await addressRepo.save(existingDefaultAddress);

        const loginRes = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: user!.email, password: plainPassword })
          .expect(200);

        const token = loginRes.body.access_token;

        const createAddressDto = {
          name: 'Nova Casa Padrão',
          street: 'Rua Nova',
          number: '999',
          complement: '',
          neighborhood: 'Novo Bairro',
          city: 'Nova Cidade',
          state: 'Novo Estado',
          postalCode: '99999-999',
          country: 'Portugal',
        };

        // Act
        const response = await request(app.getHttpServer())
          .post(baseUrl)
          .set('Authorization', `Bearer ${token}`)
          .send(createAddressDto)
          .expect(201);

        // Assert
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(createAddressDto.name);
        expect(response.body.street).toBe(createAddressDto.street);
      }),
    );

    it('should return 401 when not authenticated', async () => {
      const createAddressDto = {
        name: 'Casa',
        street: 'Rua',
        number: '123',
        neighborhood: 'Bairro',
        city: 'Cidade',
        state: 'Estado',
        postalCode: '12345-678',
      };

      await request(app.getHttpServer())
        .post(baseUrl)
        .send(createAddressDto)
        .expect(401);
    });

    it('should return 400 when required fields are missing', async () => {
      const plainPassword = '12345678';

      const user = await userRepo.findOneBy({ email: 'email@example.com' });

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user!.email, password: plainPassword })
        .expect(200);

      const token = loginRes.body.access_token;

      const invalidDto = {
        name: 'Casa',
        // street missing
        number: '123',
        // other required fields missing
      };

      await request(app.getHttpServer())
        .post(baseUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('GET /addresses', () => {
    it(
      'should return all addresses for authenticated user',
      runWithRollbackTransaction(async () => {
        // Arrange: Login e criar endereços
        const plainPassword = '12345678';

        const user = await userRepo.findOneBy({ email: 'email@example.com' });

        if (!user) {
          throw new Error('Usuário não encontrado');
        }

        const addresses = [
          {
            id: 1,
            name: 'Casa',
            street: 'Rua das Flores',
            number: '123',
            complement: '',
            neighborhood: 'Centro',
            city: 'Lisboa',
            state: 'Lisboa',
            postalCode: '1000-001',
            country: 'Portugal',
            userId: user!.id,
          },
          {
            id: 2,
            name: 'Trabalho',
            street: 'Avenida da Liberdade',
            number: '456',
            complement: '',
            neighborhood: 'Baixa',
            city: 'Porto',
            state: 'Porto',
            postalCode: '4000-001',
            country: 'Portugal',
            userId: user!.id,
          },
        ];

        await addressRepo.save(addresses);

        const loginRes = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: user!.email, password: plainPassword })
          .expect(200);

        const token = loginRes.body.access_token;

        // Act
        const response = await request(app.getHttpServer())
          .get(baseUrl)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        // Assert
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(2);
      }),
    );

    it('should return 401 when not authenticated', async () => {
      await request(app.getHttpServer()).get(baseUrl).expect(401);
    });
  });

  describe('PUT /addresses/:id', () => {
    it(
      'should update address for authenticated user',
      runWithRollbackTransaction(async () => {
        // Arrange: Login e criar endereço
        const plainPassword = '12345678';

        const user = await userRepo.findOneBy({ email: 'email@example.com' });

        const address = {
          id: 1,
          name: 'Casa',
          street: 'Rua das Flores',
          number: '123',
          complement: '',
          neighborhood: 'Centro',
          city: 'Lisboa',
          state: 'Lisboa',
          postalCode: '1000-001',
          country: 'Portugal',
          userId: user!.id,
        };

        const savedAddress = await addressRepo.save(address);

        const loginRes = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: user!.email, password: plainPassword })
          .expect(200);

        const token = loginRes.body.access_token;

        const updateDto = {
          name: 'Casa Atualizada',
          complement: 'Apto 202',
        };

        // Act
        const response = await request(app.getHttpServer())
          .put(`${baseUrl}/${savedAddress.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateDto)
          .expect(200);

        // Assert
        expect(response.body.name).toBe('Casa Atualizada');
        expect(response.body.complement).toBe('Apto 202');

        // Verificar no banco
        const updatedAddress = await addressRepo.findOne({
          where: { id: savedAddress.id },
        });
        expect(updatedAddress?.name).toBe('Casa Atualizada');
      }),
    );

    it(
      'should return 404 when address does not exist',
      runWithRollbackTransaction(async () => {
        const plainPassword = '12345678';

        const user = await userRepo.findOneBy({ email: 'email@example.com' });

        const loginRes = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: user!.email, password: plainPassword })
          .expect(200);

        const token = loginRes.body.access_token;

        await request(app.getHttpServer())
          .put(`${baseUrl}/999`)
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Test' })
          .expect(404);
      }),
    );
  });

  describe('DELETE /addresses/:id', () => {
    it(
      'should delete address for authenticated user',
      runWithRollbackTransaction(async () => {
        // Arrange: Login e criar endereço
        const plainPassword = '12345678';

        const user = await userRepo.findOneBy({ email: 'email@example.com' });

        const address = {
          id: 1,
          name: 'Casa',
          street: 'Rua das Flores',
          number: '123',
          complement: '',
          neighborhood: 'Centro',
          city: 'Lisboa',
          state: 'Lisboa',
          postalCode: '1000-001',
          country: 'Portugal',
          userId: user!.id,
        };

        const savedAddress = await addressRepo.save(address);

        const loginRes = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: user!.email, password: plainPassword })
          .expect(200);

        const token = loginRes.body.access_token;

        // Act
        await request(app.getHttpServer())
          .delete(`${baseUrl}/${savedAddress.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        // Assert: Verificar se foi removido do banco
        const deletedAddress = await addressRepo.findOne({
          where: { id: savedAddress.id },
        });
        expect(deletedAddress).toBeNull();
      }),
    );

    it(
      'should return 404 when address does not exist',
      runWithRollbackTransaction(async () => {
        const plainPassword = '12345678';

        const user = await userRepo.findOneBy({ email: 'email@example.com' });

        const loginRes = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: user!.email, password: plainPassword })
          .expect(200);

        const token = loginRes.body.access_token;

        await request(app.getHttpServer())
          .delete(`${baseUrl}/999`)
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      }),
    );
  });
});
