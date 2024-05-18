import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from '@app/config/config';
import { AuthModule } from '@app/modules/auth/auth.module';
import { NegotiationsModule } from '@app/modules/negotiations/negotiations.module';
import { AppController } from '@app/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    AuthModule,
    NegotiationsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
