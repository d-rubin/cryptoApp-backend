import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { PrismaService } from '../prisma.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CoinService {
  private readonly logger = new Logger(CoinService.name);
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async getCoins(): Promise<string> {
    const coins = await this.prisma.coin.findMany({
      orderBy: { marketCapRank: 'asc' },
    });
    if (
      coins.length > 0 &&
      coins[0].lastUpdated.getTime() > Date.now() - 1000 * 60 * 60 // Heute - 1 Stunde
    ) {
      return JSON.stringify({ coins: coins });
    }

    const url =
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&sparkline=true&price_change_percentage=7d&locale=de&precision=2';
    const { data } = await firstValueFrom(
      this.httpService
        .get(url, {
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': process.env.API_KEY,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    const keys = [
      'id',
      'symbol',
      'name',
      'current_price',
      'market_cap_rank',
      'price_change_percentage_7d_in_currency',
      'last_updated',
      'image',
    ];

    if (
      Array.isArray(data) &&
      typeof data[0] === 'object' &&
      keys.every((key) => new Set(Object.keys(data[0])).has(key))
    ) {
      data.map(async (data: any) => {
        const coins = await this.prisma.coin.findMany();
        const isCoinExistent = coins.some((coin) => coin.coinId === data.id);
        let command;
        if (isCoinExistent) {
          command = this.prisma.coin.update;
        } else {
          command = this.prisma.coin.create;
        }

        await command({
          data: {
            coinId: data.id,
            symbol: data.symbol,
            name: data.name,
            currentPrice: data.current_price,
            marketCapRank: data.market_cap_rank,
            priceChangePercentage7dInCurrency:
              data.price_change_percentage_7d_in_currency,
            lastUpdated: new Date(data.last_updated),
            image: data.image,
          },
          where: isCoinExistent ? { coinId: data.id } : undefined,
        });
      });

      const coins = await this.prisma.coin.findMany({
        orderBy: { marketCapRank: 'asc' },
      });
      return JSON.stringify({
        coins,
      });
    }

    return JSON.stringify({ message: 'Data is missing required keys' });
  }
}
