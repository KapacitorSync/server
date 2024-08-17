import { Module } from '@nestjs/common'

import { SessionService } from '@/session/session.service'
import { SessionController } from '@/session/session.controller'
import { UserService } from '@/user/user.service'

@Module({
  controllers: [SessionController],
  providers: [UserService, SessionService]
})
export class SessionModule { }
