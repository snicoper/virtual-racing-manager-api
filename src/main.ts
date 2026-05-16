import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './core/config/app.config';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { createValidationPipe } from './core/pipes/create-validation.pipe';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors({
    origin: AppConfig.corsOrigin,
    credentials: true,
  });

  await app.listen(AppConfig.port ?? 3000);
}

void bootstrap();
