import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';

@Injectable()
export class AutentiqueService {
  constructor(private readonly configService: ConfigService) {}

  async createDocument(negotiationId, signers, type) {
    const data = new FormData();

    console.log(signers);

    data.append(
      'operations',
      `{"query":"mutation CreateDocumentMutation($document: DocumentInput!, $signers: [SignerInput!]!, $file: Upload!) {createDocument(document: $document, signers: $signers, file: $file) {id name refusable sortable created_at signatures { public_id name email created_at action { name } link { short_link } user { id name email }}}}", "variables":{"document": {"name": "${type}"},"signers": ${JSON.stringify(
        signers,
      )},"file":null}}`,
    );
    data.append('map', '{"file": ["variables.file"]}');
    data.append(
      'file',
      fs.createReadStream(`./pdf/${type}-${negotiationId}.pdf`),
    );

    const config = {
      method: 'post',
      url: 'https://api.autentique.com.br/v2/graphql',
      headers: {
        Authorization: `Bearer ${this.configService.get<string>(
          'autentique.token',
        )}`,
        ...data.getHeaders(),
      },
      data: data,
    };

    return await axios(config);
  }

  async getDocument(documentId) {
    const data = {
      query: `query { document(id: "${documentId}") { id name refusable sortable created_at files { original signed } signatures { public_id name email created_at action { name } link { short_link } user { id name email } email_events { sent opened delivered refused reason } viewed { ...event } signed { ...event } rejected { ...event } } } } fragment event on Event { ipv4 ipv6 reason created_at geolocation { country countryISO state stateISO city zipcode latitude longitude } }`,
    };

    const config = {
      method: 'post',
      url: 'https://api.autentique.com.br/v2/graphql',
      headers: {
        Authorization: `Bearer ${this.configService.get<string>(
          'autentique.token',
        )}`,
      },
      data,
    };

    return await axios(config);
  }
}
