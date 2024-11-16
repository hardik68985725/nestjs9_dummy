import { IsNotEmpty, IsString } from "class-validator"
import { DispatchDetailsDto } from "./dispatchdetails.dto"

export class DispatchOrderDto extends DispatchDetailsDto {
  /* @IsString()
  @IsNotEmpty({ message: "required_id" })
  id: string */
}
