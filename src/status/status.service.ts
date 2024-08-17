import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { execFile, type ExecException } from 'child_process'

import { StorageUsageDto } from '@/status/dtos/storage-usage.dto'

import type { StorageUsage } from '@/status/types'
import type { ApiResponse } from '@/types/response'

@Injectable()
export class StatusService {
  async storageUsage(storageUsageDto: StorageUsageDto): Promise<ApiResponse<StorageUsage>> {
    const status: Promise<StorageUsage> = (await new Promise((resolve, reject): void => {
      execFile(
        'df',
        ['-k', '--', storageUsageDto.path],
        (error: ExecException | null, stdout: string): void => {
          if (error) reject(error.message)

          const lines: string[] = stdout.trim().split('\n')
          const stats: string[] = lines[lines.length - 1].split(/\s+/)

          resolve({
            total: (parseInt(stats[1], 10) / 1024 ** 2).toFixed(2),
            used: (parseInt(stats[2], 10) / 1024 ** 2).toFixed(2),
            free: (parseInt(stats[3], 10) / 1024 ** 2).toFixed(2)
          } as StorageUsage)
        }
      )
    }).catch((): void => {
      throw new InternalServerErrorException('error_failed_getting_usage')
    })) as Promise<StorageUsage>

    return {
      body: await status
    }
  }
}
