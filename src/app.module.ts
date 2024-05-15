import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from '@app/config/config';
import { AuthModule } from '@app/modules/auth/auth.module';
import { NegotiationsModule } from '@app/modules/negotiations/negotiations.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'pdf'),
    }),
    AuthModule,
    NegotiationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
