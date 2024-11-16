import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"
import { User } from "src/modules/user/schemas/user.schema"

@Schema()
export class DispatchDetails {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    trim: true,
    required: true,
    immutable: true
  })
  dispatched_by: Types.ObjectId | User

  @Prop({
    trim: true,
    required: true
  })
  quantity: number

  @Prop({
    trim: true,
    required: true
  })
  driver_mobile_phone_number: string

  @Prop({
    trim: true,
    required: true
  })
  truck_number: string

  @Prop({
    trim: true,
    required: true
  })
  other_details: string
}

export const SchemaDispatchDetails =
  SchemaFactory.createForClass(DispatchDetails)
