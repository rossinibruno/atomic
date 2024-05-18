import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

interface IRecordNegotiation {
  id: string;
  price: number;
  amount: number;
  status: string;
}

interface IRequest {
  type: string;
  table: string;
  record: IRecordNegotiation;
  schema: string;
  old_record: IRecordNegotiation;
}

@Injectable()
export class NegotiationsService {
  constructor(
    @InjectQueue('documentQueue') private readonly documentQueue: Queue,
    @InjectQueue('paymentQueue') private readonly paymentQueue: Queue,
  ) {}

  async start(request: IRequest) {
    if (
      request.old_record.status !== 'COMPLETED' &&
      request.record.status === 'COMPLETED'
    ) {
      await this.documentQueue.add({
        type: 'CONTRACT',
        negotiationId: request.record.id,
      });
      await this.paymentQueue.add({
        negotiationId: request.record.id,
      });
    }
  }
}
