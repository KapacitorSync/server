import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CheckDiskHealthDto {
  @IsNotEmpty({
    message: '[path]cant_be_empty'
  })
  @ApiProperty()
  path: string
}
