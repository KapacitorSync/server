import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { JwtModule } from "@nestjs/jwt";

import { ExceptionFilter } from '@/filters/exception.filter'
import { PoliceGuard } from '@/guards/police.guard'
import { ResponseBodyModifierInterceptor } from '@/interceptors/response-body-modifier.interceptor'
import { AppController } from "@/app/app.controller";
import { SessionModule } from "@/session/session.module";
import { UserModule } from "@/user/user.module";
import { HealthModule } from "@/health/health.module";
import { StatusModule } from "@/status/status.module";
import { PrismaModule } from "@/modules/prisma.module";

import kapacitorConfig from "kapacitor.config.json";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: kapacitorConfig.secret,
      signOptions: { noTimestamp: true },
    }),
    PrismaModule,
    SessionModule,
    UserModule,
    HealthModule,
    StatusModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PoliceGuard
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseBodyModifierInterceptor
    }
  ],
})
export class AppModule { }
