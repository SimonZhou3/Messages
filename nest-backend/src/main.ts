import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as fs from 'fs';
import * as session from 'express-session';
import * as https from "https";

async function bootstrap() {
  const CLIENT_URL = 'https://localhost:3000';
  const key = fs.readFileSync('../cert/CA/localhost/localhost.decrypted.key');
  const cert = fs.readFileSync('../cert/CA/localhost/localhost.crt');
  const httpsOptions = { key, cert };
  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.use(
      session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 60 * 60 * 1000 },
      }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
      origin: CLIENT_URL,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
  });

  await app.listen(8000);
}
bootstrap();
