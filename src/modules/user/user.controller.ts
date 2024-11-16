import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req
} from "@nestjs/common"
import { Roles } from "src/common/decorators"
import { user_roles } from "src/common/enums"
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard"
import { RolesGuard } from "src/common/guards/roles.guard"
import {
  ChangeStatusDto,
  CreateUserDto,
  FindUserDto,
  SaveProfileDto,
  UpdateUserDto
} from "./dto"
import { UserService } from "./user.service"

@Controller("user")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(user_roles.owner)
  create(@Req() req: any, @Body() createUserDto: CreateUserDto) {
    return this.userService.create({
      ...createUserDto,
      created_by: req.user.data
    })
  }

  @Post("gsud")
  get_signed_user_detials(@Req() req: any) {
    return this.userService.get_signed_user_detials(req.user.data)
  }

  @Post("list")
  findAll(@Req() req: any, @Body() findUserDto: FindUserDto) {
    return this.userService.findAll(findUserDto, req.user.data)
  }

  @Post("profile")
  profile(@Req() req: any) {
    return this.userService.profile(req.user.data)
  }

  @Post("profile/:id")
  save_profile(
    @Param("id") id: string,
    @Body() saveProfileDto: SaveProfileDto
  ) {
    return this.userService.save_profile(id, saveProfileDto)
  }

  @Post("change_status")
  @Roles(user_roles.owner)
  change_status(@Body() changeStatusDto: ChangeStatusDto) {
    return this.userService.change_status(changeStatusDto)
  }

  @Post("get_user_of_role/:role")
  @Roles(user_roles.owner)
  get_user_of_role(@Param("role") role: user_roles) {
    return this.userService.get_user_of_role(role)
  }

  @Post("get_users_has_role/:role")
  @Roles(user_roles.owner, user_roles.sales_officer)
  get_users_has_role(@Req() req: any, @Param("role") role: user_roles) {
    console.log(req.user)
    return this.userService.get_users_has_role(role, req.user.data)
  }

  @Post(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(":id")
  @Roles(user_roles.owner)
  remove(@Param("id") id: string) {
    return this.userService.remove(id)
  }
}
