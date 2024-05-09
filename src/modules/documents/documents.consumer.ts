import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('documentQueue')
export class DocumentConsumer {
  private readonly logger = new Logger(DocumentConsumer.name);

  @Process()
  async create(job: Job) {
    this.logger.log(`Transcoding message: ${job.id}`);
    this.logger.debug('Data:', job.data);
    this.logger.log(`Transcoding complete for job: ${job.id}`);
  }
}
