import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectQueue('documentQueue') private readonly transcodeQueue: Queue,
  ) {}

  async start(negotiationId: string) {
    await this.transcodeQueue.add({
      type: 'CONTRACT',
      negotiationId,
    });
  }
}
