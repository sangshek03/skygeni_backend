import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig, DatabaseConfig } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from './v1/v1.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    V1Module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
