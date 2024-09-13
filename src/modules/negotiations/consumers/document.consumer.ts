import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PdfCreator } from '../../../util/pdfCreator';
import { Supabase } from '@app/util/supabase';
import { format } from 'date-fns';
import { AutentiqueService } from '@app/modules/negotiations/autentique.service';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'es6-promisify';
import * as fs from 'fs';
const rmFile = promisify(fs.rm);

@Processor('documentQueue')
export class DocumentConsumer {
  private readonly logger = new Logger(DocumentConsumer.name);
  supabase;

  constructor(
    private readonly configService: ConfigService,
    private pdfCreator: PdfCreator,
    private supabaseClient: Supabase,
    private autentiqueService: AutentiqueService,
  ) {
    this.supabase = this.supabaseClient.createClient();

    this.supabase.auth.signInWithPassword({
      email: this.configService.get<string>('supabase.username'),
      password: this.configService.get<string>('supabase.password'),
    });
  }

  @Process()
  async create(job: Job) {
    const { negotiationId, type } = job.data;

    const negotiation = (
      await this.supabase
        .from('negotiations')
        .select(
          '*, orders(*, products(*), warehouses(*), productQualities(*), companies(*)), farmers(*), companies(*)',
        )
        .eq('id', negotiationId)
        .single()
    ).data;

    const { farmers } = negotiation;
    const trader = negotiation.companies;
    const buyer = negotiation.orders.companies;
    const { warehouses } = negotiation.orders;

    const payload = {
      document: {
        createdAt: format(new Date(negotiation.createdAt), 'yyyy-MM-dd'),
      },
      buyer: {
        businessName: buyer.businessName,
        cnpj: buyer.cnpj,
        stateRegistration: buyer.stateRegistration,
        streetAddress: buyer.streetAddress,
        numberAddress: buyer.numberAddress,
        complementAddress: buyer.complementAddress,
        suburbAddress: buyer.suburbAddress,
        zipCodeAddress: buyer.zipCodeAddress,
        cityAddress: buyer.cityAddress,
        stateAddress: buyer.stateAddress,
      },
      farmer: {
        name: farmers.name,
        cpf: farmers.cpf,
        stateRegistration: farmers.stateRegistration,
        partnerStatus: farmers.partnerStatus,
        partnerName: farmers.partnerName,
        partnerCpf: farmers.partnerCpf,
        streetAddress: farmers.streetAddress,
        numberAddress: farmers.numberAddress,
        complementAddress: farmers.complementAddress,
        suburbAddress: farmers.suburbAddress,
        zipCodeAddress: farmers.zipCodeAddress,
        cityAddress: farmers.cityAddress,
        stateAddress: farmers.stateAddress,
        coffeeArea: '',
      },
      trader: {
        businessName: trader.businessName,
        cnpj: trader.cnpj,
        stateRegistration: trader.stateRegistration,
        streetAddress: trader.streetAddress,
        numberAddress: trader.numberAddress,
        complementAddress: trader.complementAddress,
        suburbAddress: trader.suburbAddress,
        zipCodeAddress: trader.zipCodeAddress,
        cityAddress: trader.cityAddress,
        stateAddress: trader.stateAddress,
        bankName: trader.bankName,
        bankNumber: trader.bankNumber,
        bankAgency: trader.bankAgency,
        bankAccount: trader.bankAccount,
        bankNationalRegister: trader.cnpj,
      },
      negotiation: {
        id: negotiation.id,
        typeCoffee: negotiation.orders.products.name,
        qualityCoffee: negotiation.orders.productQualities.quality,
        harvestSeason: negotiation.orders.harvestSeason,
        amount: negotiation.amount,
        descriptionCoffee: negotiation.orders.productQualities.description,
        certificate: negotiation.orders.certificate,
        price: negotiation.orders.price,
        totalPrice: negotiation.price,
        interestIncluded: negotiation.orders.interestIncluded,
        deliveryDate: '',
      },
      warehouse: {
        name: warehouses.name,
        streetAddress: warehouses.streetAddress,
        numberAddress: warehouses.numberAddress,
        complementAddress: warehouses.complementAddress,
        suburbAddress: warehouses.suburbAddress,
        cityAddress: warehouses.cityAddress,
        stateAddress: warehouses.stateAddress,
      },
    };

    await this.pdfCreator.create(payload, negotiationId, type);

    const signers = [
      {
        phone: `+55${String(farmers.phoneNumber).replace(/[^\d.]+/g, '')}`,
        action: 'SIGN',
        delivery_method: 'DELIVERY_METHOD_WHATSAPP',
      },
      // {
      //   email: 'berossini@gmail.com',
      //   action: 'SIGN',
      // },
    ];

    if (farmers.partnerStatus === 'CASADO') {
      signers.push({
        phone: `+55${String(farmers.partnerPhoneNumber).replace(
          /[^\d.]+/g,
          '',
        )}`,
        action: 'SIGN',
        delivery_method: 'DELIVERY_METHOD_WHATSAPP',
      });
    }

    try {
      const response = await this.autentiqueService.createDocument(
        negotiationId,
        signers,
        type,
      );

      const documentId = response.data.data.createDocument.id;

      await this.supabase.from('documents').insert({
        negotiationId,
        documentId,
        type,
      });

      await rmFile(`./pdf/${type}-${negotiationId}.pdf`);

      this.logger.log(`document-creator complete for job: ${job.id}`);
    } catch (error) {
      console.log(error);
      this.logger.error(`document-creator error for job: ${job.id}`);
    }
  }
}
