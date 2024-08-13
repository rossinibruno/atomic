import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentConsumer } from '@app/modules/negotiations/consumers/document.consumer';
import { PdfCreator } from '@app/util/pdfCreator';
import { Supabase } from '@app/util/supabase';
import { AutentiqueService } from '@app/modules/negotiations/autentique.service';
import { WebhookController } from '@app/modules/negotiations/webhook.controller';
import { NegotiationsService } from '@app/modules/negotiations/negotiations.service';
import { EfiService } from '@app/modules/negotiations/efi.service';
import { PaymentConsumer } from '@app/modules/negotiations/consumers/payment.consumer';
import { DocumentController } from '@app/modules/negotiations/document.controller';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'documentQueue',
    }),
    BullModule.registerQueue({
      name: 'paymentQueue',
    }),
  ],
  controllers: [WebhookController, DocumentController],
  providers: [
    NegotiationsService,
    DocumentConsumer,
    PaymentConsumer,
    PdfCreator,
    Supabase,
    AutentiqueService,
    EfiService,
  ],
})
export class NegotiationsModule {}
