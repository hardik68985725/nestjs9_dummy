import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { firm_types } from "src/common/enums"
import { Address, SchemaAddress } from "./address.schema"

@Schema()
export class UserDealer {
  @Prop({
    trim: true,
    required: true,
    immutable: true
  })
  dealer_code: string

  @Prop({
    trim: true,
    required: true
  })
  authorized_person_name: string

  @Prop({
    type: String,
    enum: Object.keys(firm_types),
    trim: true,
    default: firm_types.other
  })
  firm_type?: firm_types

  @Prop({
    type: SchemaAddress,
    required: true
  })
  firm_address: Address

  @Prop({
    type: SchemaAddress,
    required: true
  })
  godown_address: Address

  @Prop({
    trim: true,
    required: true
  })
  godown_capacity: string

  @Prop({
    trim: true,
    required: true
  })
  gst_number: string

  @Prop({
    trim: true,
    required: true
  })
  pan_detail: string
}

export const SchemaUserDealer = SchemaFactory.createForClass(UserDealer)
