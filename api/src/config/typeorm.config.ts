import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'myuser',
  password: 'mypassword',
  database: 'mydatabase',
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  synchronize: true, // TODO: Desativar isso e criar migrations!
  autoLoadEntities: true,
};
