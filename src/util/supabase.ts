import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class Supabase {
  supabase;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      `https://${this.configService.get<string>(
        'SUPABASE_PROJECT',
      )}.supabase.co`,
      `${this.configService.get<string>('SUPABASE_TOKEN')}`,
    );
  }

  createClient() {
    return this.supabase;
  }
}
