import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'

export enum Platform {
  Android = 'android',
  Linux = 'linux',
  Web = 'web',
  Other = 'other'
}

export class NewSessionDto {
  @IsNotEmpty({
    message: '[username]cant_be_empty'
  })
  @ApiProperty()
  username: string

  @IsNotEmpty({
    message: '[password]cant_be_empty'
  })
  @ApiProperty()
  password: string

  @IsEnum(Platform, {
    message: '[platform]invalid_value'
  })
  @IsNotEmpty({
    message: '[platform]cant_be_empty'
  })
  @ApiProperty()
  platform: Platform
}
