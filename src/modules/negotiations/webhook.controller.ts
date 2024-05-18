import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NegotiationsService } from '@app/modules/negotiations/negotiations.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private negotiationsService: NegotiationsService) {}

  @Post('negotiations')
  @UseGuards(AuthGuard('basic'))
  async proccessNegotiation(@Body() body): Promise<any> {
    try {
      await this.negotiationsService.start(body);
      this.logger.log(
        `successfully on process webhook: ${JSON.stringify(body)}`,
      );
    } catch (error) {
      this.logger.error(`error on process webhook: ${JSON.stringify(body)}`);
    }
  }

  @Post('payments')
  async proccessPayment(@Body() body): Promise<any> {
    try {
      this.logger.log(
        `successfully on process webhook: ${JSON.stringify(body)}`,
      );
    } catch (error) {
      this.logger.error(`error on process webhook: ${JSON.stringify(body)}`);
    }
  }
}
