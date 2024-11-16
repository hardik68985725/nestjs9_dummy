import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsString, ValidateNested } from "class-validator"
import { AddressDto } from "."

export class UserProfileDto {
  @IsString()
  @IsNotEmpty({ message: "required_mobile_phone_number" })
  mobile_phone_number: string

  @IsString()
  @IsNotEmpty({ message: "required_profile_picture" })
  profile_picture: string

  @IsString()
  @IsNotEmpty({ message: "required_first_name" })
  first_name: string

  @IsString()
  @IsNotEmpty({ message: "required_last_name" })
  last_name: string

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: "required_birth_date" })
  birth_date: Date

  @Type(() => AddressDto)
  @ValidateNested()
  @IsNotEmpty({ message: "required_address" })
  address: AddressDto
}
