import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { createCorsOriginValidator } from "./config/cors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(
    helmet({
      // This API is deliberately called cross-origin by every subdomain
      // (admin., control., every tenant) — Helmet's default same-origin CORP
      // would have the browser silently discard those responses even though
      // CORS explicitly allowed them. CORS (above) remains the real
      // authorization boundary for who can read a response with credentials.
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );
  app.use(cookieParser(config.getOrThrow<string>("sessionSecret")));
  app.enableCors({
    origin: createCorsOriginValidator(
      config.getOrThrow<string>("cookieDomain"),
      config.get<string[]>("corsOrigins") ?? []
    ),
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.setGlobalPrefix("api/v1", { exclude: ["health"] });

  const port = config.get<number>("port") ?? 4000;
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}`);
}

bootstrap();
