import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { SessionService } from '@/session/session.service'
import { NewSessionDto } from '@/session/dtos/new-session.dto'

import type { ApiResponse } from '@/types/response'

@ApiHeader({
  name: 'X-Server-Password'
})
@ApiTags('session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

@ApiOperation({
    summary: 'Create session',
    description: 'Creates a new session returning JWT'
  })
  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @Post('/')
  async new(@Body() newSessionDto: NewSessionDto): Promise<ApiResponse> {
    return await this.sessionService.new(newSessionDto)
  }
}
