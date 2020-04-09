import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes';
import { AuthGuard } from './guards';
import { AppExceptionFilter } from './filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AuthGuard());
  app.useGlobalFilters(new AppExceptionFilter());
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
