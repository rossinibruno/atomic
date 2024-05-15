import { EfiService } from '@app/modules/negotiations/efi.service';
import { Supabase } from '@app/util/supabase';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { addDays, format } from 'date-fns';

@Processor('paymentQueue')
export class PaymentConsumer {
  private readonly logger = new Logger(PaymentConsumer.name);
  supabase;

  constructor(
    private configService: ConfigService,
    private supabaseClient: Supabase,
    private efiService: EfiService,
  ) {
    this.supabase = this.supabaseClient.createClient();

    this.supabase.auth.signInWithPassword({
      email: this.configService.get<string>('supabase.username'),
      password: this.configService.get<string>('supabase.password'),
    });
  }

  @Process()
  async create(job: Job) {
    try {
      const { negotiationId } = job.data;

      const negotiation = (
        await this.supabase
          .from('negotiations')
          .select('*, companies(*)')
          .eq('id', negotiationId)
          .single()
      ).data;

      const payload = {
        negotiationId: negotiation.id,
        value: String(Number(negotiation.price).toFixed(2)),
        dueDate: format(
          addDays(new Date(negotiation.createdAt), 5),
          'yyyy-MM-dd',
        ),
        trader: {
          cnpj: negotiation.companies.cnpj,
          businessName: negotiation.companies.businessName,
          streetAddress: negotiation.companies.streetAddress,
          cityAddress: negotiation.companies.cityAddress,
          stateAddress: negotiation.companies.stateAddress,
          zipCodeAddress: negotiation.companies.zipCodeAddress,
        },
      };

      const pixData = await this.efiService.createPix(payload);

      const payment = await this.supabase
        .from('payments')
        .insert(pixData)
        .select('id, dueDate, value, txid, status, codePix')
        .single();

      await this.supabase
        .from('negotiations')
        .update({
          paymentId: payment.data.id,
        })
        .eq('id', negotiationId);
      this.logger.log(`payment-creator complete for job: ${job.id}`);
    } catch (error) {
      console.log(error);
      this.logger.error(`payment-creator error for job: ${job.id}`);
    }
  }
}
