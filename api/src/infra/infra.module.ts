import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';
import { DatabaseModule } from './database/database.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env', '.env.development', '.env.test', '.env.production'],
    }),
    AuthModule,
    DatabaseModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class InfraModule {}
