import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'

import type { ApiResponse } from '@/types/response'

import packageJson from 'package.json'

@ApiHeader({
  name: 'X-Server-Password'
})
@ApiTags('app')
@Controller()
export class AppController {
  @ApiOperation({
    summary: 'Server version',
    description: 'Returns the version of this server'
  })
  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @Get('/')
  getServerVersion(): ApiResponse<{
    version: string
  }> {
    return { body: { version: 'v' + packageJson.version } }
  }

  @ApiOperation({
    summary: 'Test call',
    description: 'Returns nothing'
  })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @Get('/test')
  test(): ApiResponse<true> {
    return {
      body: true
    }
  }
}
