import type { ApiResponse } from '@/types/response'
import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler
} from '@nestjs/common'

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ResponseBodyModifierInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: Partial<ApiResponse>): ApiResponse => {
        return {
          message: data['message'] || '',
          body: data['body'] || {}
        } as ApiResponse
      })
    )
  }
}
