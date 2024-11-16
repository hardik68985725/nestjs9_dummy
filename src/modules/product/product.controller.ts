import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common"
import { Roles } from "src/common/decorators"
import { user_roles } from "src/common/enums"
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard"
import { RolesGuard } from "src/common/guards/roles.guard"
import { CreateProductDto, FindProductDto, UpdateProductDto } from "./dto"
import { ProductService } from "./product.service"

@Controller("product")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(user_roles.owner)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto)
  }

  @Post("list")
  findAll(@Body() findProductDto: FindProductDto) {
    return this.productService.findAll(findProductDto)
  }

  @Post(":id")
  findOne(@Param("id") id: string) {
    return this.productService.findOne(id)
  }

  @Patch(":id")
  @Roles(user_roles.owner)
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto)
  }

  @Delete(":id")
  @Roles(user_roles.owner)
  remove(@Param("id") id: string) {
    return this.productService.remove(id)
  }
}
