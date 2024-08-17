import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Matches } from 'class-validator'

export class StorageUsageDto {
  @Matches(/^\/(?:[\w-]+\/)*[\w-]+$/, {
    message: '[path]invalid'
  })
  @IsNotEmpty({
    message: '[path]cant_be_empty'
  })
  @ApiProperty()
  path: string
}
