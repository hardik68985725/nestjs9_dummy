import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Patch
} from "@nestjs/common"
import { Roles } from "src/common/decorators"
import { user_roles } from "src/common/enums"
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard"
import { RolesGuard } from "src/common/guards/roles.guard"
import { OrderService } from "./order.service"
import {
  ChangeStatusDto,
  CreateOrderDto,
  DispatchOrderDto,
  FindOrderDto,
  UpdateOrderDto
} from "./dto"

@Controller("order")
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(user_roles.owner, user_roles.sales_officer, user_roles.dealer)
  create(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(
      {
        ...createOrderDto,
        created_by: req.user.data
      },
      req.user.data
    )
  }

  @Post("list")
  findAll(@Req() req: any, @Body() findOrderDto: FindOrderDto) {
    return this.orderService.findAll(findOrderDto, req.user.data)
  }

  @Post("change_status")
  @Roles(user_roles.owner)
  change_status(@Body() changeStatusDto: ChangeStatusDto) {
    return this.orderService.change_status(changeStatusDto)
  }

  @Post("dispatch_order/:id")
  dispatch_order(
    @Req() req: any,
    @Param("id") id: string,
    @Body() dispatchOrderDto: DispatchOrderDto
  ) {
    return this.orderService.dispatch_order(id, dispatchOrderDto, req.user.data)
  }

  @Post(":id")
  findOne(@Param("id") id: string) {
    return this.orderService.findOne(id)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto)
  }

  @Delete(":id")
  @Roles(user_roles.owner)
  remove(@Param("id") id: string) {
    return this.orderService.remove(id)
  }
}
