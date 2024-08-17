import { Module, Global } from '@nestjs/common'

import { PrismaService } from '@/db/prisma'

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useValue: new PrismaService()
    }
  ],
  exports: [PrismaService]
})
export class PrismaModule { }
