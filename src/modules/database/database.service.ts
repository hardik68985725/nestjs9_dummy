import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose"

@Injectable()
export class DatabaseService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const mongodb_uri: string = `mongodb://${this.configService.get(
      "MONGO_USER"
    )}:${this.configService.get("MONGO_PASSWORD")}${this.configService.get(
      "MONGO_PATH"
    )}`

    return { uri: mongodb_uri, useNewUrlParser: true }
  }
}
