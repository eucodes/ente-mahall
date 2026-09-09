import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // The web app calls this API from every tenant subdomain, admin.<root>, and
  // the marketing root — an allowlist of fixed origins doesn't work here, so
  // origin is validated against the same ROOT_DOMAIN the web app's proxy uses.
  const rootDomain = process.env.ROOT_DOMAIN ?? 'localhost';
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true); // same-origin / non-browser clients (Flutter)
      const { hostname } = new URL(origin);
      const allowed = hostname === rootDomain || hostname.endsWith(`.${rootDomain}`);
      callback(allowed ? null : new Error('Not allowed by CORS'), allowed);
    },
  });

  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
