import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { AppModule } from 'src/app.module';
import { Role, User } from 'src/domain/user/user.entity';
import { createTestingApp } from 'test/utils/create-testing-app';
import { runWithRollbackTransaction } from 'test/utils/database/test-transation';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

describe('UserController - Integration (HTTP)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;

  const baseUrl = '/auth';

  beforeAll(async () => {
    app = await createTestingApp({
      imports: [AppModule],
    });

    // Pipe global de validação (se você usa)
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    await app.close();
    jest.restoreAllMocks();
  });

  it(
    'POST /auth/register - should register a new user',
    runWithRollbackTransaction(async () => {
      const dto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        // role: 'user',
      };

      const response = await request(app.getHttpServer())
        .post(`${baseUrl}/register`)
        .send(dto)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(typeof response.body.access_token).toBe('string');

      // Check if user saved in DB
      const savedUser = await userRepo.findOne({ where: { email: dto.email } });
      expect(savedUser).toBeDefined();
      expect(savedUser?.name).toBe(dto.name);
    }),
  );

  it('POST /auth/login - should login existing user', async () => {
    const plainPassword = '12345678';

    const testUser = {
      publicId: '7f6a28b1-3efe-52bb-b301-b68217cd7447',
      name: 'John Doe',
      email: 'email@example.com',
      password: plainPassword,
      role: Role.ADMIN,
    };

    // Act
    const response = await request(app.getHttpServer())
      .post(`${baseUrl}/login`)
      .send({ email: testUser.email, password: plainPassword })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    expect(typeof response.body.access_token).toBe('string');
  });

  it('GET /auth/me - should return current user profile when authenticated', async () => {
    // Arrange: criar usuário e fazer login para pegar token
    const plainPassword = '12345678';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const testUser = {
      publicId: '7f6a28b1-3efe-52bb-b301-b68217cd7447',
      name: 'John Doe',
      email: 'email@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
    };

    const loginRes = await request(app.getHttpServer())
      .post(`${baseUrl}/login`)
      .send({ email: testUser.email, password: plainPassword })
      .expect(200);

    const token = loginRes.body.access_token;

    // Act
    const response = await request(app.getHttpServer())
      .get(`${baseUrl}/me`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(testUser.email);
    expect(response.body.name).toBe(testUser.name);
    expect(response.body.role).toBe(testUser.role);
  });

  it('GET /auth/me - should return 401 when token is missing or invalid', async () => {
    await request(app.getHttpServer()).get(`${baseUrl}/me`).expect(401);

    await request(app.getHttpServer())
      .get(`${baseUrl}/me`)
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
  });
});
