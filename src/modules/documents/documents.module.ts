import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentConsumer } from '@app/modules/documents/documents.consumer';
import { PdfCreator } from '@app/util/pdfCreator';
import { Supabase } from '@app/util/supabase';

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
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentConsumer, PdfCreator, Supabase],
})
export class DocumentsModule {}
