import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class NegotiationsService {
  constructor(
    @InjectQueue('documentQueue') private readonly documentQueue: Queue,
    @InjectQueue('paymentQueue') private readonly paymentQueue: Queue,
  ) {}

  async start(negotiationId: string) {
    await this.documentQueue.add({
      type: 'CONTRACT',
      negotiationId,
    });
    await this.paymentQueue.add({
      negotiationId,
    });
  }
}
