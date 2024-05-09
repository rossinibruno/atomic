import { Controller, Get, Param } from '@nestjs/common';
import { DocumentsService } from '@app/modules/documents/documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get(':negotiationId')
  // @UseGuards(AuthGuard('basic'))
  async find(@Param('negotiationId') negotiationId: string): Promise<any> {
    await this.documentsService.start(negotiationId);

    return 'ok';
  }
}
