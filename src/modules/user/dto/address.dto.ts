import { IsNotEmpty, IsString } from "class-validator"

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  address_line_1: string

  @IsString()
  @IsNotEmpty()
  village_town_city: string

  @IsString()
  @IsNotEmpty()
  taluka: string

  @IsString()
  @IsNotEmpty()
  district: string

  @IsString()
  @IsNotEmpty()
  pin_code: string

  @IsString()
  @IsNotEmpty()
  state: string
}
