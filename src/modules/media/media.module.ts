import { Module } from "@nestjs/common"
import { UserService } from "../user/user.service"
import { MediaController } from "./media.controller"
import { MediaService } from "./media.service"

@Module({
  imports: [],
  controllers: [MediaController],
  providers: [MediaService, UserService]
})
export class MediaModule {}
