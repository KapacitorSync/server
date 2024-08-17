import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext
} from '@nestjs/common'

import type { FastifyRequest } from 'fastify'

import kapacitorConfig from 'kapacitor.config.json'

@Injectable()
export class PoliceGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: FastifyRequest = context.switchToHttp().getRequest()

    if (request.url === '/test') {
      return true
    }

    if (!request.headers['x-server-password']) {
      throw new UnauthorizedException('no_server_password')
    }

    if (request.headers['x-server-password'] !== kapacitorConfig.serverPassword) {
      throw new UnauthorizedException('bad_server_password')
    }

    return true
  }
}
