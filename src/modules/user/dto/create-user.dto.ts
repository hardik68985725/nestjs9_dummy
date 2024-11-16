import { OmitType } from "@nestjs/mapped-types"
import { UserDto } from "."

export class CreateUserDto extends OmitType(UserDto, [
  "password",
  "new_password"
]) {}
