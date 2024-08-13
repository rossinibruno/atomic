import { AutentiqueService } from '@app/modules/negotiations/autentique.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('document')
export class DocumentController {
  constructor(private autentiqueService: AutentiqueService) {}

  @Get('/:id')
  async findDocument(@Param('id') id): Promise<any> {
    const response = await this.autentiqueService.getDocument(id);

    return response.data;
  }
}
