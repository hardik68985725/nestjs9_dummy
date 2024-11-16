import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { DatabaseService } from "./database.service"

@Module({
  imports: [MongooseModule.forRootAsync({ useClass: DatabaseService })],
  exports: [MongooseModule]
})
export class DatabaseModule {}
