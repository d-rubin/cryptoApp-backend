import { HttpModule } from '@nestjs/axios';
import { CoinService } from './coin.service';
import { CoinController } from './coin.controller';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [HttpModule],
  providers: [PrismaService, CoinService],
  controllers: [CoinController],
})
export class CoinModule {}
