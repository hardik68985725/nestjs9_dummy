import { Transform, Type } from "class-transformer"
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  // ValidateIf,
  ValidateNested
} from "class-validator"
import { AddressDto } from "src/modules/user/dto"
import { DispatchDetailsDto } from "./dispatchdetails.dto"
import { order_status } from "src/common/enums"

export class OrderDto {
  @IsString()
  @IsNotEmpty({ message: "required_product" })
  product: string

  @Transform(({ value }) => {
    return Number.parseFloat(value as unknown as string)
  })
  @IsNotEmpty({ message: "required_quantity" })
  quantity: number

  @IsString()
  // @IsNotEmpty({ message: "required_dealer" })
  @IsOptional()
  dealer: string

  @Type(() => AddressDto)
  @ValidateNested()
  @IsNotEmpty({ message: "required_address" })
  address: AddressDto

  @Type(() => DispatchDetailsDto)
  @ValidateNested()
  @IsOptional()
  dispatch_details?: DispatchDetailsDto

  @IsEnum(order_status, { message: "invalid_status" })
  @IsOptional()
  status?: order_status
}
