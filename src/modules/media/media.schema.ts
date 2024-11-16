import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Model } from "mongoose"
import { status } from "src/common/enums"

@Schema({
  timestamps: { createdAt: "_created_at", updatedAt: "_updated_at" },
  toObject: { virtuals: false, versionKey: false },
  toJSON: { virtuals: false, versionKey: false }
})
export class Media {
  @Prop({
    trim: true,
    required: true
  })
  media_file_path: string

  @Prop({
    trim: true,
    required: true
  })
  original_file_name: string

  @Prop({
    trim: true,
    required: true
  })
  media_file_name: string

  @Prop({
    trim: true,
    required: true
  })
  media_file_url: string

  @Prop({
    trim: true,
    required: true
  })
  file_type: string

  @Prop({
    trim: true,
    required: true
  })
  thumbnail: string

  @Prop({
    type: String,
    enum: Object.keys(status),
    trim: true,
    default: status.active
  })
  status?: status
}

export const SchemaMedia = SchemaFactory.createForClass(Media)
export type document_media = HydratedDocument<Media>
export interface I_ModelMedia extends Model<document_media> {}
export const model_media = Media.name
