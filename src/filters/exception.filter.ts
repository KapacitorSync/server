import type { ApiResponse } from '@/types/response'
import {
  type ExceptionFilter as NestExceptionFilter,
  Catch,
  type ArgumentsHost,
  HttpException
} from '@nestjs/common'
import { BaseWsExceptionFilter } from '@nestjs/websockets'

import type { FastifyReply } from 'fastify'

@Catch(HttpException)
export class ExceptionFilter extends BaseWsExceptionFilter implements NestExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const response: FastifyReply = host.switchToHttp().getResponse()

    const exceptionResponse = exception.getResponse() as any

    response.status(exception.getStatus()).send({
      message: !exceptionResponse?.message
        ? exception.message || 'error'
        : typeof exceptionResponse?.message === 'string'
          ? exceptionResponse?.message
          : exceptionResponse?.message[0],
      body: {}
    } as ApiResponse)
  }
}
