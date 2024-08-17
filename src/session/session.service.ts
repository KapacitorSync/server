import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import bcrypt from 'bcrypt'
import crypto from 'crypto'

import { UserService } from '@/user/user.service'
import { NewSessionDto } from '@/session/dtos/new-session.dto'
import { PrismaService } from '@/db/prisma'

import type { ApiResponse } from '@/types/response'
import type { Token, User } from '@prisma/client'
import type { JwtPayload } from '@/types/jwt'

import kapacitorConfig from 'kapacitor.config.json'

@Injectable()
export class SessionService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) { }

  async validate(
    password: NewSessionDto['password'],
    dbPassword: User['password']
  ): Promise<boolean> {
    if (
      !(await bcrypt.compare(
        crypto
          .createHash('sha256')
          .update(
            kapacitorConfig.secret.split('').reverse().join('') + password + kapacitorConfig.secret
          )
          .digest('hex'),
        dbPassword
      ))
    ) {
      return false
    }

    return true
  }

  async new(newSessionDto: NewSessionDto): Promise<
    ApiResponse<{
      token: string
    }>
  > {
    const user: User | null = await this.userService.findByUsername(newSessionDto.username)
    if (!user) {
      throw new NotFoundException('error_user_dosent_exist')
    }

    if (!this.validate(newSessionDto.password, user.password)) {
      throw new UnauthorizedException('error_wrong_password')
    }

    const generatedToken: string = crypto.randomBytes(64).toString('hex')

    const expiresAt: Date = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const token: Token = await this.prisma.token.create({
      data: {
        token: generatedToken,
        expiresAt
      }
    })

    await this.prisma.session.create({
      data: {
        platform: newSessionDto.platform,

        Token: {
          connect: {
            id: token.id
          }
        },

        User: {
          connect: {
            id: user.id
          }
        }
      }
    })

    return {
      message: 'new_session_success',
      body: {
        token: await this.jwtService.signAsync({
          id: user.id,

          token: generatedToken
        } as JwtPayload)
      }
    }
  }
}
