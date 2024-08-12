import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as fs from 'fs';

async function bootstrap() {
  // const httpsOptions = {
  //   cert: fs.readFileSync('/opt/bitnami/apache/conf/bitnami/certs/server.crt'), // Certificado fullchain do dominio
  //   key: fs.readFileSync('/opt/bitnami/apache/conf/bitnami/certs/server.key'), // Chave privada do domínio
  //   ca: fs.readFileSync('./certificates/chain-pix-sandbox.crt'), // Certificado público da Efí
  //   minVersion: 'TLSv1.2',
  //   requestCert: true,
  //   rejectUnauthorized: true, //Caso precise que os demais endpoints não rejeitem requisições sem mTLS, você pode alterar para false
  // };

  const app = await NestFactory.create(AppModule, {
    // httpsOptions,
  });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
