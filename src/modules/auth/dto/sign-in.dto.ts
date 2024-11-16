import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class SignInDto {
  @IsString()
  @IsEmail({}, { message: "invalid_email" })
  @IsNotEmpty({ message: "required_email" })
  email: string

  @IsString()
  @IsNotEmpty({ message: "required_password" })
  password: string
}
