import { Module } from '@nestjs/common';
import { DomainModule } from './domain/domain.module';
import { InfraModule } from './infra/infra.module';
import { IntegrationModule } from './integration/integration.module';

@Module({
  imports: [InfraModule, IntegrationModule, DomainModule],
})
export class AppModule {}
