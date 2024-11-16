import { OmitType } from "@nestjs/mapped-types"
import { IsNotEmpty, IsString } from "class-validator"
import { UserDto } from "."

export class SaveProfileDto extends OmitType(UserDto, [
  "parent_user",
  "password"
]) {
  @IsString()
  @IsNotEmpty({ message: "required_password" })
  password?: string
}
