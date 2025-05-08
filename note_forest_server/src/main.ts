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
    origin: ['*'], // 前端 SSR 项目的地址
    credentials: true, // 如果使用 cookie/token
  });
  app.enableVersioning({
    type: VersioningType.URI
  })

  await app.listen(process.env.PORT ?? 8081);
}
bootstrap();
