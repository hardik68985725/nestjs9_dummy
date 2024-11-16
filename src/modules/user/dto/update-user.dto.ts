import { OmitType } from "@nestjs/mapped-types"
import { IsNotEmpty, IsString } from "class-validator"
import { UserDto } from "."

export class UpdateUserDto extends OmitType(UserDto, ["password", "role"]) {
  @IsString()
  @IsNotEmpty({ message: "required_password" })
  password?: string
}
