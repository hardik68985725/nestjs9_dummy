import { Transform } from "class-transformer"
import { IsNotEmpty, IsString } from "class-validator"

export class DispatchDetailsDto {
  @Transform(({ value }) => {
    return Number.parseInt(value as unknown as string)
  })
  @IsNotEmpty({ message: "required_quantity" })
  quantity: number

  @IsString()
  @IsNotEmpty({ message: "required_driver_mobile_phone_number" })
  driver_mobile_phone_number: string

  @IsString()
  @IsNotEmpty({ message: "required_truck_number" })
  truck_number: string

  @IsString()
  @IsNotEmpty({ message: "required_other_details" })
  other_details: string
}
