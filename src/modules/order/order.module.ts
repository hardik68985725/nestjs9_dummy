import { Module } from "@nestjs/common"
import { OrderService } from "./order.service"
import { OrderController } from "./order.controller"
import { UserService } from "../user/user.service"
import { ProductService } from "../product/product.service"

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [OrderService, UserService, ProductService],
  exports: [OrderService]
})
export class OrderModule {}
