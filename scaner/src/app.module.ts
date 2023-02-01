import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AggTradesModule } from './aggTrades/aggTrades.module';
import { DeltaModule } from './delta/Delta.module';
import ormConfig from './config/orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(ormConfig),
    AggTradesModule,
    DeltaModule,
  ],
})
export class AppModule {}
