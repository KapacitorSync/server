import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { SwaggerModule, DocumentBuilder, type OpenAPIObject } from '@nestjs/swagger'
import { WsAdapter } from '@nestjs/platform-ws'

import compression from '@fastify/compress'
import helmet from '@fastify/helmet'

import { AppModule } from '@/app.module'

import packageJson from 'package.json'

const bootstrap = async (): Promise<void> => {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: process.env.NODE_ENV == 'development'
    })
  )

  await app.register(compression)
  await app.register(helmet, {
    contentSecurityPolicy: false
  })

  app.enableCors()

  app.useWebSocketAdapter(new WsAdapter(app))

  if (process.env.SWAGGER) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Kapacitor: Server')
      .setDescription('Kapacitor: Server API documentation')
      .setVersion(packageJson.version)
      .setLicense('GPL-3.0', 'https://www.gnu.org/licenses/gpl-3.0.en.html')
      .addBearerAuth()
      .build()

    const document: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('docs', app, document)
  }

  await app.listen((process.env.PORT as unknown as number) || 3000, '0.0.0.0')
}
bootstrap()
