import { ConfigLibService } from '@lib/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     disableErrorMessages: false,
  //   }),
  // );

  const config = app.get(ConfigLibService);
  const port = config.get('PORT');

  await app.listen(port);

  Logger.log('API running on port ' + port, 'Bootstrap');
}
bootstrap();
