import { Transform } from "class-transformer"
import { IsEnum, isString, IsString } from "class-validator"
import { FindDto } from "src/common/dtos"

enum sort_by {
  _created_at = "_created_at",
  quantity = "quantity",
  status = "status"
}

export class FindOrderDto extends FindDto {
  @IsEnum(sort_by, { message: "invalid_sort_column" })
  sort_by: string = "_created_at"

  @IsString()
  @Transform(({ value }) => {
    if (isString(value)) {
      value = (value as any).replaceAll("-", "")
    }
    return value
  })
  fields: string = `quantity
  address
  dispatch_details
  created_by
  status
  _created_at
  dealer.profile.first_name
  dealer.profile.last_name
  product.product_name
  product.product_picture
  product.product_description
  product.product_price
  product.status`
}
