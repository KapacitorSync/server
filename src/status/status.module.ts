import { Module } from '@nestjs/common'

import { StatusController } from '@/status/status.controller'
import { StatusGateway } from '@/status/status.gateway'
import { StatusService } from '@/status/status.service'

@Module({
  controllers: [StatusController],
  providers: [StatusGateway, StatusService]
})
export class StatusModule {}
