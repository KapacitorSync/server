import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { HealthController } from '@/health/health.controller'
import { HealthService } from '@/health/health.service'

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: false
    })
  ],
  controllers: [HealthController],
  providers: [HealthService]
})
export class HealthModule {}
