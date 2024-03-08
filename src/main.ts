import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from './http-exception/exception.filter';
import { CustomException } from './http-exception/custom-exception';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (error) => {
        const errorMessage = error
          .map((error) => Object.values(error.constraints))
          .join(', ');

        return new CustomException(
          'pipe',
          'Bad Request',
          `Type and validation errors : ${errorMessage}`,
          400,
        );
      },
    }),
  );
  app.useGlobalFilters(new CustomExceptionFilter(logger));

  await app.listen(process.env.PORT || 80);
}
bootstrap();
