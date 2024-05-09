import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from '@app/modules/payments/payments.module';
import { config } from '@app/config/config';
import { AuthModule } from '@app/modules/auth/auth.module';
import { DocumentsModule } from '@app/modules/documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    AuthModule,
    PaymentsModule,
    DocumentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
