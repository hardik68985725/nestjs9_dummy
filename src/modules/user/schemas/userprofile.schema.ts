import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"
import { Media, model_media } from "src/modules/media/media.schema"
import { Address, SchemaAddress } from "./address.schema"

@Schema()
export class UserProfile {
  @Prop({
    trim: true,
    required: true,
    index: true
  })
  mobile_phone_number: string

  @Prop({
    trim: true,
    required: true,
    type: Types.ObjectId,
    ref: model_media
  })
  profile_picture: Types.ObjectId | Media

  @Prop({
    trim: true,
    required: true
  })
  first_name: string

  @Prop({
    trim: true,
    required: true
  })
  last_name: string

  @Prop({
    trim: true,
    required: true
  })
  birth_date: Date

  @Prop({
    type: SchemaAddress,
    required: true
  })
  address: Address
}

export const SchemaUserProfile = SchemaFactory.createForClass(UserProfile)
