import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { hashSync } from "bcrypt"
import {
  mkdirSync,
  copyFileSync,
  rmSync,
  existsSync,
  constants as fs_constants,
  renameSync
} from "fs"
import { extname, join, resolve } from "path"
import { MediaDto } from "./dto/media.dto"
import { model_media, I_ModelMedia } from "./media.schema"

@Injectable()
export class MediaService {
  private readonly rootPath: string = resolve(join(__dirname, "/../../../"))
  private readonly uploadsPath: string = resolve(join(this.rootPath, "uploads"))
  private readonly tempFolderPath: string = resolve(
    join(this.uploadsPath, "temp")
  )

  constructor(
    @InjectModel(model_media) private readonly mediaModel: I_ModelMedia
  ) {}

  async saveTo(
    sourceFile: Express.Multer.File,
    destinationFolderPath: string
  ): Promise<boolean | string> {
    const newDestinationFolderPath: string = resolve(
      join(this.uploadsPath, destinationFolderPath)
    )
    try {
      await mkdirSync(newDestinationFolderPath, { recursive: true })
    } catch (error) {
      console.log(__filename, " > saveTo > mkdirSync > catch > ", error)
      return false
    }

    const sourceFilePath = resolve(
      join(this.tempFolderPath, sourceFile.filename)
    )
    const destinationFilePath = resolve(
      join(newDestinationFolderPath, sourceFile.filename)
    )

    if (await existsSync(destinationFilePath)) {
      const newFileName: string = await hashSync(sourceFile.originalname, 1)
        .replace(/[^a-zA-Z ]/g, "")
        .concat(extname(sourceFile.originalname))
      sourceFile.filename = newFileName

      await renameSync(
        sourceFile.path,
        resolve(join(this.tempFolderPath, newFileName))
      )

      return await this.saveTo(sourceFile, destinationFolderPath)
    }

    try {
      await copyFileSync(
        sourceFilePath,
        destinationFilePath,
        fs_constants.COPYFILE_EXCL
      )
    } catch (error) {
      console.log(__filename, " > saveTo > copyFileSync > catch > ", error)
      return false
    }

    try {
      await rmSync(sourceFilePath)
    } catch (error) {
      console.log(__filename, " > saveTo > rmSync > catch > ", error)
      return false
    }

    return destinationFilePath
  }

  async create(mediaDto: MediaDto) {
    try {
      const media = await this.mediaModel.create(mediaDto)
      return { media: media._id }
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new BadRequestException(error.errors)
      }
      console.log(__filename, " > create > catch > ", error)
      throw new ServiceUnavailableException()
    }
  }

  async get(mediaUrl: string) {
    const sourceFilePath = resolve(join(this.uploadsPath, mediaUrl))
    if (await existsSync(sourceFilePath)) {
      return sourceFilePath
    }

    throw new NotFoundException()
  }
}
