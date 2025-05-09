import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {TransformInterceptor} from "./common/interceptors/transform/transform.interceptor";
import {AllExceptionFilter} from './common/filters/all-exception.filter';
import {VersioningType} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  app.setGlobalPrefix('/api')
  app.enableCors({
    origin: (origin, callback) => {
      // 只要请求带了 Origin，就允许
      callback(null, origin || '*');
    },
    credentials: true,
  });
  app.enableVersioning({
    type: VersioningType.URI
  })

  await app.listen(process.env.PORT ?? 8081);
}
bootstrap();
