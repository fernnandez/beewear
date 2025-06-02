import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { DomainModule } from './domain/domain.module';
import { InfraModule } from './infra/infra.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), InfraModule, DomainModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
