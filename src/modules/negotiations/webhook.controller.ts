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

  // @Get(':negotiationId')
  // // @UseGuards(AuthGuard('basic'))
  // async find(@Param('negotiationId') negotiationId: string): Promise<any> {
  //   const body = {
  //     type: 'UPDATE',
  //     table: 'negotiations',
  //     record: {
  //       id: '9d91504e-88ce-4c6a-94ff-c65bb8871cc7',
  //       price: 3232.3,
  //       amount: 10,
  //       status: 'COMPLETED',
  //       orderId: '4709ea4a-7651-43c9-8464-6a2c2d53979a',
  //       farmerId: '82d8011b-bcf4-4fff-89c0-59d7910e63c8',
  //       traderId: '532629a7-b4f7-492a-abc5-5ea8b2f3f537',
  //       createdAt: '2024-05-15T18:32:50.594717+00:00',
  //       paymentId: '72d3c07f-b5cb-4d51-b469-4fd29509befd',
  //     },
  //     schema: 'public',
  //     old_record: {
  //       id: '9d91504e-88ce-4c6a-94ff-c65bb8871cc7',
  //       price: 3232.3,
  //       amount: 11,
  //       status: 'PENDING',
  //       orderId: '4709ea4a-7651-43c9-8464-6a2c2d53979a',
  //       farmerId: '82d8011b-bcf4-4fff-89c0-59d7910e63c8',
  //       traderId: '532629a7-b4f7-492a-abc5-5ea8b2f3f537',
  //       createdAt: '2024-05-15T18:32:50.594717+00:00',
  //       paymentId: '72d3c07f-b5cb-4d51-b469-4fd29509befd',
  //     },
  //   };

  //   await this.negotiationsService.start(body);

  //   return 'ok';
  // }

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
