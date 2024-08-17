import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { UserService } from '@/user/user.service'
import { CreateUserDto } from '@/user/dtos/create-user.dto'

import type { ApiResponse } from '@/types/response'

@ApiHeader({
  name: 'X-Server-Password'
})
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create user',
    description: 'Creates an user'
  })
  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @Post('/')
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    return await this.userService.create(createUserDto)
  }
}
