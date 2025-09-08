import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DomainModule } from './domain/domain.module';
import { InfraModule } from './infra/infra.module';
import { IntegrationModule } from './integration/integration.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    InfraModule,
    IntegrationModule,
    DomainModule,
  ],
})
export class AppModule {}
