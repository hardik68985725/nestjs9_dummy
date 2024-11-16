import { IsEnum, IsNumber } from "class-validator"

enum sort_type {
  asc = "asc",
  desc = "desc"
}

export class FindDto {
  @IsNumber()
  page_no: number = 1

  @IsNumber()
  limit: number = 10

  @IsEnum(sort_type, { message: "invalid_sort_type" })
  sort_type: string = "asc"
}
