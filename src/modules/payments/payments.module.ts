import { Module } from '@nestjs/common';
import { PaymentsController } from '@app/modules/payments/payments.controller';
import { PaymentsService } from '@app/modules/payments/payments.service';
import { EfiService } from './efi.service';
import { Supabase } from '@app/util/supabase';

@Module({
  controllers: [PaymentsController],
  providers: [Supabase, PaymentsService, EfiService],
})
export class PaymentsModule {}
