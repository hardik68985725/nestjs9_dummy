import { Transform } from "class-transformer"
import { IsEnum, IsOptional, IsNotEmpty, IsString } from "class-validator"
import { status } from "src/common/enums"

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: "required_product_name" })
  product_name: string

  @IsString()
  @IsNotEmpty({ message: "required_product_picture" })
  product_picture: string

  @IsString()
  @IsNotEmpty({ message: "required_product_description" })
  product_description: string

  @Transform(({ value }) => {
    return Number.parseInt(value as unknown as string)
  })
  @IsNotEmpty({ message: "required_product_price" })
  product_price: number

  @IsEnum(status, { message: "invalid_status" })
  @IsOptional()
  status?: status
}
