import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentConsumer } from '@app/modules/negotiations/consumers/document.consumer';
import { PdfCreator } from '@app/util/pdfCreator';
import { Supabase } from '@app/util/supabase';
import { AutentiqueService } from '@app/modules/negotiations/autentique.service';
import { NegotiationsController } from '@app/modules/negotiations/negotiations.controller';
import { NegotiationsService } from '@app/modules/negotiations/negotiations.service';
import { EfiService } from '@app/modules/negotiations/efi.service';
import { PaymentConsumer } from '@app/modules/negotiations/consumers/payment.consumer';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: 'localhost',
          port: 6379,
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
  controllers: [NegotiationsController],
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
