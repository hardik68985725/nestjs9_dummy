import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { status } from "src/common/enums"

export class ChangeStatusDto {
  @IsString()
  @IsNotEmpty({ message: "required_id" })
  id: string

  @IsEnum(status, { message: "invalid_status" })
  @IsNotEmpty({ message: "required_status" })
  status: status
}
