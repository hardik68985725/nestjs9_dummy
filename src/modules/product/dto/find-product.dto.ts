import { Transform } from "class-transformer"
import { IsEnum, isString, IsString } from "class-validator"
import { FindDto } from "src/common/dtos"

enum sort_by {
  _created_at = "_created_at",
  status = "status",
  product_name = "product_name",
  product_price = "product_price"
}

export class FindProductDto extends FindDto {
  @IsEnum(sort_by, { message: "invalid_sort_column" })
  sort_by: string = "_created_at"

  @IsString()
  @Transform(({ value }) => {
    if (isString(value)) {
      value = (value as any).replaceAll("-", "")
    }
    return value
  })
  fields: string = `
    product_name
    product_description
    product_price
    status
  `
}
