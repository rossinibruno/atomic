import { PaymentsService } from '@app/modules/payments/payments.service';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get(':negotiationId')
  // @UseGuards(AuthGuard('basic'))
  async find(@Param('negotiationId') negotiationId: string): Promise<any> {
    return (await this.paymentsService.findOrCreate(negotiationId)).data;
  }
}
