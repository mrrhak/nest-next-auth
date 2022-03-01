import { ConfigLibService } from '@lib/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3001']
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const config = app.get(ConfigLibService);
  const port = config.get('PORT');

  await app.listen(port);

  Logger.log('API running on port ' + port, 'Bootstrap');
}
bootstrap();
