import { Controller, Get, Header } from '@nestjs/common';
import { CoinService } from './coin.service';

@Controller('coins')
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  async getCoins(): Promise<string> {
    return this.coinService.getCoins();
  }
}
