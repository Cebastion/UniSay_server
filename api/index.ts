import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { VercelRequest, VercelResponse } from "@vercel/node";

let appPromise;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!appPromise) {
    appPromise = NestFactory.create(AppModule, { logger: false }).then(
      (app) => {
        app.enableCors();
        return app.init();
      }
    );
  }
  const app = await appPromise;

  app.getHttpAdapter().getInstance()(req, res);
}
