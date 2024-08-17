import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { PrismaService } from '@/db/prisma'

import type { Token } from '@prisma/client'
import type { JwtPayload } from '@/types/jwt'
import type { FastifyRequest } from 'fastify'

import kapacitorConfig from 'kapacitor.config.json'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest()

    const token: string | undefined = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException('no_auth_token')
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: kapacitorConfig.secret
      })

      const _token: Token | null = await this.prisma.token.findFirst({
        where: {
          token: payload.token,
          expiresAt: {
            gt: new Date()
          },

          Session: {
            some: {
              userId: payload.id
            }
          }
        },
        include: {
          Session: true
        }
      })

      if (!_token) {
        throw new UnauthorizedException('bad_auth_token_or_expired')
      }
    } catch {
      throw new UnauthorizedException('bad_auth_token')
    }

    return true
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = (request.headers['authorization'] as string | undefined)?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
