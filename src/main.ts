import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

config();

async function bootstrap() {
  const logger = new Logger('ecommerce-log');
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('The Ecommerce API description')
    .setVersion('1.0')
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('core/api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(helmet());

  const port = process.env.PORT ?? 3001;

  await app.listen(port);
  logger.log(`App is listening on port ${port}`);
}
bootstrap();
