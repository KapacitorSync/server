import { ForbiddenException, Injectable } from '@nestjs/common'

import bcrypt from 'bcrypt'
import crypto from 'crypto'

import { CreateUserDto } from '@/user/dtos/create-user.dto'
import { PrismaService } from '@/db/prisma'

import type { ApiResponse } from '@/types/response'
import type { User } from '@prisma/client'

import kapacitorConfig from 'kapacitor.config.json'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async findByUsername(username: User['username']): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        username
      }
    })
  }

  async create(createUserDto: CreateUserDto): Promise<ApiResponse> {
    if (await this.findByUsername(createUserDto.username)) {
      throw new ForbiddenException('error_user_exists')
    }

    await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        name: createUserDto.name,

        password: await bcrypt.hash(
          crypto
            .createHash('sha256')
            .update(
              kapacitorConfig.secret.split('').reverse().join('') +
              createUserDto.password +
              kapacitorConfig.secret
            )
            .digest('hex'),
          await bcrypt.genSalt(10)
        )
      }
    })

    return {
      message: 'user_created_success',
      body: {}
    }
  }
}
