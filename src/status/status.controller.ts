import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { StatusService } from '@/status/status.service'
import { StorageUsageDto } from '@/status/dtos/storage-usage.dto'

import type { StorageUsage } from '@/status/types'
import type { ApiResponse } from '@/types/response'

@ApiHeader({
  name: 'X-Server-Password'
})
@ApiTags('status')
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) { }

  @ApiOperation({
    summary: 'Storage usage',
    description: 'Returns the storage usage of the provided `path` in GB'
  })
  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @Post('storage')
  async storageUsage(@Body() storageUsageDto: StorageUsageDto): Promise<ApiResponse<StorageUsage>> {
    return await this.statusService.storageUsage(storageUsageDto)
  }
}
