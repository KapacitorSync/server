import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { HealthCheck } from '@nestjs/terminus'

import { CheckDiskHealthDto } from '@/health/dtos/check-disk-health.dto'
import { HealthService } from '@/health/health.service'

import type { ApiResponse } from '@/types/response'
import type { HealthCheckResult } from '@/health/types'

@ApiHeader({
  name: 'X-Server-Password'
})
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) { }

  @ApiOperation({
    summary: 'NodeJS process memory status',
    description: `
Returns the status of NodeJS memory

The status will be bad if NodeJS is using more than 250MB of memory
`
  })
  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @HealthCheck({
    swaggerDocumentation: false
  })
  @Get('/memory')
  async checkMemoryHealth(): Promise<
    ApiResponse<{
      status: HealthCheckResult
    }>
  > {
    return await this.healthService.checkMemoryHealth()
  }

  @ApiOperation({
    summary: 'Server disk status',
    description: `
Returns the status of the disk provided by the \`path\`

The status will be bad if the disk is fuller than 90%
`
  })
  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @HealthCheck({
    swaggerDocumentation: false
  })
  @Post('/disk')
  async checkDiskHealth(@Body() checkDiskHealthDto: CheckDiskHealthDto): Promise<
    ApiResponse<{
      status: HealthCheckResult
    }>
  > {
    return await this.healthService.checkDiskHealth(checkDiskHealthDto)
  }
}
