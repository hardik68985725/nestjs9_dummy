import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { join } from "path"

import { validate } from "src/config/env.validation"
import { DatabaseModule } from "../database/database.module"
import { MongooseModelModule } from "../mongoosemodel/mongoosemodel.module"
import { AuthModule } from "../auth/auth.module"
import { MediaModule } from "../media/media.module"
import { UserModule } from "../user/user.module"
import { ProductModule } from "../product/product.module"
import { OrderModule } from "../order/order.module"
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core"
import { HttpExceptionFilter } from "src/common/exceptions/http-exception.filter"
import { TransformInterceptor } from "src/common/interceptors/transform.interceptor"
import { Paths } from "src/paths"

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      cache: true,
      expandVariables: true,
      // envFilePath: join(Paths.__ROOT_PATH, "..", ".env")
      envFilePath: join(Paths.__ROOT_PATH, ".env")
    }),
    DatabaseModule,
    MongooseModelModule,

    AuthModule,
    MediaModule,
    UserModule,
    ProductModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    AppService
  ]
})
export class AppModule {}
