import { plainToInstance } from "class-transformer"
import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsString,
  validateSync
} from "class-validator"

enum Environment {
  development = "development",
  production = "production"
}

class EnvironmentVariables {
  @IsNotEmpty() @IsEnum(Environment) NODE_ENV: Environment
  @IsNotEmpty() @IsNumber() APP_PORT: number
  @IsNotEmpty() @IsString() API_PREFIX: string
  @IsNotEmpty() @IsString() APP_URL: string
  @IsNotEmpty() @IsString() MONGO_PATH: string
  @IsNotEmpty() @IsString() MONGO_USER: string
  @IsNotEmpty() @IsString() MONGO_PASSWORD: string
  @IsNotEmpty() @IsString() JWT_SECRET: string
  @IsNotEmpty() @IsNumber() JWT_EXPIRE_IN: number
  @IsNotEmpty() @IsString() LN: string
  @IsNotEmpty() @IsString() UPLOAD_FOLDER_PATH: string
  @IsNotEmpty() @IsString() MEDIA_FILE_URL: string
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true
  })

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false
  })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return validatedConfig
}
