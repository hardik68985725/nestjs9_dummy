import { SetMetadata } from "@nestjs/common"
import { user_roles } from "../enums"

export const ROLES_KEY = "roles"
export const Roles = (...roles: user_roles[]) => SetMetadata(ROLES_KEY, roles)
