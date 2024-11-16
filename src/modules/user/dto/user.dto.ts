import { Type } from "class-transformer"
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested
} from "class-validator"
import { IsEqualsTo } from "src/common/decorators"
import { status, user_roles } from "src/common/enums"
import { UserDealerDto, UserProfileDto } from "."

export class UserDto {
  @IsString()
  @IsNotEmpty({ message: "required_parent_user" })
  parent_user: string

  @IsString()
  @IsEmail({}, { message: "invalid_email" })
  @IsNotEmpty({ message: "required_email" })
  email: string

  @IsString()
  @IsNotEmpty({ message: "required_password" })
  @MinLength(8, { message: "password_is_too_short" })
  @MaxLength(25, { message: "password_is_too_long" })
  password: string

  @IsString()
  @IsOptional()
  new_password?: string

  @ValidateIf((body: UserDto) =>
    Boolean(body.new_password && body.new_password.length)
  )
  @IsString()
  @IsEqualsTo("new_password", { message: "invalid_new_password_confirm" })
  @IsNotEmpty({ message: "required_new_password_confirm" })
  new_password_confirm: string

  @IsEnum(user_roles, { message: "invalid_role" })
  @IsOptional()
  role?: user_roles

  @IsEnum(status, { message: "invalid_status" })
  @IsOptional()
  status?: status

  @Type(() => UserProfileDto)
  @ValidateNested()
  @IsOptional()
  profile?: UserProfileDto

  @Type(() => UserDealerDto)
  @ValidateNested()
  @IsOptional()
  dealer?: UserDealerDto
}
