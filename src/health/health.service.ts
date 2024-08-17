import { Injectable } from '@nestjs/common'
import {
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
  type HealthIndicatorResult
} from '@nestjs/terminus'

import { CheckDiskHealthDto } from '@/health/dtos/check-disk-health.dto'

import type { ApiResponse } from '@/types/response'
import type { HealthCheckResult } from '@/health/types'

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator
  ) { }

  async checkMemoryHealth(): Promise<
    ApiResponse<{
      status: HealthCheckResult
    }>
  > {
    try {
      await this.health.check([
        (): Promise<HealthIndicatorResult> => this.memory.checkHeap('memory', 250 * 1024 * 1024)
      ])

      return {
        message: 'memory_health_ok',
        body: { status: 'ok' }
      }
    } catch {
      return {
        message: 'memory_health_bad',
        body: { status: 'bad' }
      }
    }
  }

  async checkDiskHealth(checkDiskHealthDto: CheckDiskHealthDto): Promise<
    ApiResponse<{
      status: HealthCheckResult
    }>
  > {
    const path: string = checkDiskHealthDto.path || '/'

    try {
      await this.health.check([
        (): Promise<HealthIndicatorResult> =>
          this.disk.checkStorage('storage', {
            path,
            thresholdPercent: 0.9
          })
      ])

      return {
        message: 'disk_health_ok',
        body: { status: 'ok' }
      }
    } catch {
      return {
        message: 'disk_health_bad',
        body: { status: 'bad' }
      }
    }
  }
}
