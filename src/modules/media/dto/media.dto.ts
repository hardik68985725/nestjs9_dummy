import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { status, uploads_folders } from "src/common/enums"

export class MediaDto {
  @IsString()
  @IsNotEmpty({ message: "required_media_file_path" })
  media_file_path: string

  @IsString()
  @IsNotEmpty({ message: "required_original_file_name" })
  original_file_name: string

  @IsString()
  @IsNotEmpty({ message: "required_media_file_name" })
  media_file_name: string

  @IsString()
  @IsNotEmpty({ message: "required_media_file_url" })
  media_file_url: string

  @IsString()
  @IsNotEmpty({ message: "required_file_type" })
  file_type: string

  @IsString()
  @IsNotEmpty({ message: "required_thumbnail" })
  thumbnail: string

  @IsEnum(status, { message: "invalid_status" })
  @IsOptional()
  status?: status
}

export class MediaBodyDto {
  @IsEnum(uploads_folders, { message: "invalid_where" })
  @IsNotEmpty({ message: "required_where" })
  where: string
}
