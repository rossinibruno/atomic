import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { NegotiationsService } from '@app/modules/negotiations/negotiations.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('negotiations')
export class NegotiationsController {
  constructor(private negotiationsService: NegotiationsService) {}

  @Get(':negotiationId')
  // @UseGuards(AuthGuard('basic'))
  async find(@Param('negotiationId') negotiationId: string): Promise<any> {
    await this.negotiationsService.start(negotiationId);

    return 'ok';
  }

  @Post('webhook*')
  async webhook(@Body() req): Promise<any> {
    console.log(JSON.stringify(req));

    return JSON.stringify(req);
  }
}
