import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private env: AppConfigService) {
    const adapter = new PrismaPg({
      connectionString: env.dbUrl,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log(
      'Available Prisma models:',
      Object.keys(this).filter(
        (k) =>
          !k.startsWith('_') &&
          !k.startsWith('$') &&
          typeof this[k] === 'object',
      ),
    );
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
