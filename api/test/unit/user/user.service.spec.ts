import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

import { AppModule } from 'src/app.module';
import { User } from 'src/domain/user/user.entity';
import { UserService } from 'src/domain/user/user.service';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';
import { setupIntegrationMocks } from 'test/utils/mocks/setup-mocks';

import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('UserService (with Real DB Interaction)', () => {
  let app: INestApplication;
  let module: TestingModule;

  let service: UserService;
  let userRepo;

  const plainPassword = '12345678';

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get<UserService>(UserService);
    userRepo = module.get(getRepositoryToken(User));

    setupIntegrationMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  describe('register', () => {
    it(
      'should register a new user and return token',
      runWithRollbackTransaction(async () => {
        const dto = {
          name: 'Novo Usuário',
          email: 'novo@email.com',
          password: plainPassword,
          role: 'admin',
        };

        const { access_token } = await service.register(dto);
        expect(access_token).toBeDefined();

        const saved = await userRepo.findOneBy({ email: dto.email });
        expect(saved).toBeDefined();
        expect(saved.name).toBe(dto.name);
        expect(await bcrypt.compare(plainPassword, saved.password)).toBe(true);
      }),
    );

    it(
      'should throw if email already exists',
      runWithRollbackTransaction(async () => {
        await userRepo.save(
          userRepo.create({
            name: 'Existente',
            email: 'existente@email.com',
            password: await bcrypt.hash(plainPassword, 10),
            role: 'admin',
          }),
        );

        const dto = {
          name: 'Outro',
          email: 'existente@email.com',
          password: plainPassword,
          role: 'admin',
        };

        await expect(service.register(dto)).rejects.toThrow(ConflictException);
      }),
    );
  });

  describe('login', () => {
    it('should login successfully and return token', async () => {
      const dto = {
        email: 'email@example.com',
        password: plainPassword,
      };

      const { access_token } = await service.login(dto);
      expect(access_token).toBeDefined();
    });

    it('should throw if email not found', async () => {
      await expect(
        service.login({
          email: 'notfound@email.com',
          password: plainPassword,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password is invalid', async () => {
      await expect(
        service.login({
          email: 'email@example.com',
          password: 'wrong-pass',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
