import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { FileInterceptor } from "@nestjs/platform-express"
import { hashSync } from "bcrypt"
import { Request, Response } from "express"
import { createReadStream } from "fs"
import { diskStorage } from "multer"
import { extname, join } from "path"
import { Public } from "src/common/decorators/public.decorator"
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard"
import { MediaBodyDto } from "./dto/media.dto"
import { MediaService } from "./media.service"
import { Paths } from "src/paths"

@Controller("media")
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(
    private readonly configService: ConfigService,
    private readonly mediaService: MediaService
  ) {}

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: join(Paths.__ROOT_PATH, "..", "uploads", "temp"),
        filename: async (
          req: Request,
          file: Express.Multer.File,
          cb: Function
        ) => {
          const newFileName: string = hashSync(file.originalname, 1)
            .replace(/[^a-zA-Z ]/g, "")
            .concat(extname(file.originalname))
          cb(null, newFileName)
        }
      })
    })
  )
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 1000 * 512
        })
        .addFileTypeValidator({
          fileType: "image/jpeg"
        })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
    )
    file: Express.Multer.File,
    @Body() mediaBodyDto: MediaBodyDto
  ) {
    await this.mediaService.saveTo(file, mediaBodyDto.where)

    const url: string = [
      this.configService
        .get<string>("MEDIA_FILE_URL")
        ?.concat(mediaBodyDto.where),
      file.filename
    ].join("/")

    const newMedia = await this.mediaService.create({
      media_file_path: mediaBodyDto.where,
      original_file_name: file.originalname,
      media_file_name: file.filename,
      media_file_url: url,
      file_type: file.mimetype,
      thumbnail: url
    })

    return {
      _id: newMedia.media,
      media_file_url: url,
      thumbnail: url
    }
  }

  @Get("get")
  @Public()
  async get(@Res() res: Response, @Query("url") mediaUrl: string) {
    createReadStream(await this.mediaService.get(mediaUrl)).pipe(res)
  }
}
