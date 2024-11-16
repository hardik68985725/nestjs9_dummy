import { Transform } from "class-transformer"
import { IsEnum, isString, IsString } from "class-validator"
import { FindDto } from "src/common/dtos"

enum sort_by {
  _created_at = "_created_at",
  email = "email",
  role = "role",
  status = "status"
}

export class FindUserDto extends FindDto {
  @IsEnum(sort_by, { message: "invalid_sort_column" })
  sort_by: string = "_created_at"

  @IsString()
  @Transform(({ value }) => {
    if (isString(value)) {
      value = (value as any).replaceAll("-", "")
    }
    return value
  })
  fields: string = `email
    role
    status
    profile.mobile_phone_number
    profile.profile_picture
    profile.first_name
    profile.last_name
    profile.address.address_line_1
    profile.address.village_town_city
    profile.address.taluka
    profile.address.district
    profile.address.pin_code
    profile.address.state`
}
