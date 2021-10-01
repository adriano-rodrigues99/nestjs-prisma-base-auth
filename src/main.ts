import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const configService = app.select(SharedModule).get(ApiConfigService);

  app.useGlobalPipes(new ValidationPipe());

  const port = configService.appConfig.port;
  await app.listen(port);

  console.info(`server running on port ${port}`);
}
bootstrap();
