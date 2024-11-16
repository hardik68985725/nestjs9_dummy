import { Type } from "class-transformer"
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator"
import { firm_types } from "src/common/enums"
import { AddressDto } from "."

export class UserDealerDto {
  @IsString()
  @IsNotEmpty({ message: "required_dealer_code" })
  dealer_code: string

  @IsString()
  @IsNotEmpty({ message: "required_authorized_person_name" })
  authorized_person_name: string

  @IsEnum(firm_types, { message: "invalid_firm_type" })
  @IsOptional()
  firm_type: firm_types

  @Type(() => AddressDto)
  @ValidateNested()
  @IsNotEmpty({ message: "required_firm_address" })
  firm_address: AddressDto

  @Type(() => AddressDto)
  @ValidateNested()
  @IsNotEmpty({ message: "required_godown_address" })
  godown_address: AddressDto

  @IsString()
  @IsNotEmpty({ message: "required_godown_capacity" })
  godown_capacity: string

  @IsString()
  @IsNotEmpty({ message: "required_gst_number" })
  gst_number: string

  @IsString()
  @IsNotEmpty({ message: "required_pan_detail" })
  pan_detail: string
}
