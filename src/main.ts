import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import {
  ExpressAdapter,
  NestExpressApplication
} from "@nestjs/platform-express"
import helmet from "helmet"
import { AppModule } from "./modules/app/app.module"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter()
  )
  const configService: ConfigService = app.get<ConfigService>(ConfigService)
  const port = configService.get<number>("APP_PORT", 3000)
  const api_prefix = configService.get<string>("api_prefix", "api/v1")

  app.enableCors()
  app.use(helmet())
  app.setGlobalPrefix(api_prefix)
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  await app.listen(port)
}
bootstrap()
