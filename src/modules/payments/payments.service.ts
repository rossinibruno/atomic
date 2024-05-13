import { Injectable } from '@nestjs/common';
import { Supabase } from '@app/util/supabase';
import { EfiService } from '@app/modules/payments/efi.service';
import { addDays, format } from 'date-fns';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
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

  async findOrCreate(negotiationId: string) {
    const { data } = await this.supabase
      .from('negotiations')
      .select('*, companies(*)')
      .eq('id', negotiationId)
      .single();

    if (!data.paymentId) {
      console.log(data.createdAt);
      const payload = {
        negotiationId: data.id,
        value: String(Number(data.price).toFixed(2)),
        dueDate: format(addDays(new Date(data.createdAt), 5), 'yyyy-MM-dd'),
        trader: {
          cnpj: data.companies.cnpj,
          businessName: data.companies.businessName,
          streetAddress: data.companies.streetAddress,
          cityAddress: data.companies.cityAddress,
          stateAddress: data.companies.stateAddress,
          zipCodeAddress: data.companies.zipCodeAddress,
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

      return payment;
    }

    return await this.supabase
      .from('payments')
      .select('id, dueDate, value, txid, status, codePix')
      .eq('id', data.paymentId)
      .single();
  }
}
