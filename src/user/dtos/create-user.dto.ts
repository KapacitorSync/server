import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @MinLength(3, {
    message: '[username]too_short'
  })
  @MaxLength(15, {
    message: '[username]too_long'
  })
  @IsNotEmpty({
    message: '[username]cant_be_empty'
  })
  @ApiProperty({
    minimum: 3,
    maximum: 15
  })
  username: string

  @MinLength(2, {
    message: '[name]too_short'
  })
  @MaxLength(10, {
    message: '[name]too_long'
  })
  @IsNotEmpty({
    message: '[name]cant_be_empty'
  })
  @ApiProperty({
    minimum: 2,
    maximum: 10
  })
  name: string

  @MinLength(8, {
    message: '[password]too_short'
  })
  @MaxLength(4096, {
    message: '[password]too_long'
  })
  @IsNotEmpty({
    message: '[password]cant_be_empty'
  })
  @ApiProperty({
    minimum: 8,
    maximum: 4096
  })
  password: string
}
