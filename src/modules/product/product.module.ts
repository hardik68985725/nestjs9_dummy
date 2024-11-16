import { Module } from "@nestjs/common"
import { ProductService } from "./product.service"
import { ProductController } from "./product.controller"
import { UserService } from "../user/user.service"

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProductService, UserService]
})
export class ProductModule {}
