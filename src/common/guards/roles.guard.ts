import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { UserService } from "src/modules/user/user.service"
import { ROLES_KEY } from "../decorators"
import { user_roles } from "../enums"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<user_roles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    )
    if (!requiredRoles) {
      return true
    }
    let { user } = context.switchToHttp().getRequest()
    try {
      user = await this.userService.findOne(user.data)
    } catch (error) {
      return false
    }
    return requiredRoles.some((role) => user.role?.includes(role))
  }
}
