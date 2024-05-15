import * as https from 'https';
import axios from 'axios';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EfiService {
  credentials;
  p12;

  constructor(private configService: ConfigService) {
    this.credentials = {
      clientId: this.configService.get<string>('efi.clientId'),
      clientSecret: this.configService.get<string>('efi.secret'),
    };

    this.p12 = fs.readFileSync(
      join(
        process.cwd(),
        'dist/modules/negotiations/certificates/homol.p12',
      ).toString(),
    );
  }

  async createPix(payload) {
    /************************/
    /*********LOGIN/*********/
    /************************/
    const configLogin = {
      method: 'POST',
      url: 'https://pix-h.api.efipay.com.br/oauth/token',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            this.credentials.clientId + ':' + this.credentials.clientSecret,
          ).toString('base64'),
        'Content-Type': 'application/json',
      },
      httpsAgent: new https.Agent({
        pfx: this.p12,
      }),
      data: JSON.stringify({ grant_type: 'client_credentials' }),
    };

    const { data } = await axios(configLogin);

    /*****************************/
    /*********CREATE PIX/*********/
    /*****************************/
    const txid = uuidv4().replace(new RegExp('-', 'g'), '');

    const configPix = {
      method: 'PUT',
      url: `https://pix-h.api.efipay.com.br/v2/cobv/${txid}`,
      headers: {
        Authorization: 'Bearer ' + data.access_token,
        'Content-Type': 'application/json',
      },
      httpsAgent: new https.Agent({
        pfx: this.p12,
      }),
      data: {
        calendario: {
          dataDeVencimento: '2024-05-20',
          // dataDeVencimento: payload.dueDate,
          validadeAposVencimento: 5,
        },
        devedor: {
          cnpj: payload.trader.cnpj,
          email: 'admin@gmail.com',
          nome: payload.trader.businessName,
          logradouro: payload.trader.streetAddress,
          cidade: payload.trader.cityAddress,
          uf: payload.trader.stateAddress,
          cep: payload.trader.zipCodeAddres,
        },
        valor: {
          original: payload.value,
        },
        chave: payload.negotiationId,
      },
    };

    try {
      const response = await axios(configPix);

      const { calendario, valor, status, pixCopiaECola } = response.data;

      return {
        dueDate: calendario.dataDeVencimento,
        value: valor.original,
        txid,
        status,
        codePix: pixCopiaECola,
        partnerResponse: response.data,
      };
    } catch (error) {
      console.log(error.response.data);
    }
  }
}
