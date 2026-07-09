import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app/app.module';

function captureRawBody(req: any, _res: any, buf: Buffer) {
  if (buf?.length) {
    req.rawBody = buf;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.use(json({ limit: '10mb', verify: captureRawBody }));
  app.use(urlencoded({ extended: true, verify: captureRawBody }));
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  const config = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('WhatsApp Meta Lab')
    .setDescription('Laboratoire pédagogique pour observer la WhatsApp Business Cloud API, les webhooks Meta, Prisma et Swagger.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(config.get<number>('PORT', 3000));
}

bootstrap();
