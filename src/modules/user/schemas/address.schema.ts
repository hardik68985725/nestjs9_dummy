import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

@Schema()
export class Address {
  @Prop({
    trim: true,
    required: true
  })
  address_line_1: string

  @Prop({
    trim: true,
    required: true
  })
  village_town_city: string

  @Prop({
    trim: true,
    required: true
  })
  taluka: string

  @Prop({
    trim: true,
    required: true
  })
  district: string

  @Prop({
    trim: true,
    required: true
  })
  pin_code: string

  @Prop({
    trim: true,
    required: true
  })
  state: string
}

export const SchemaAddress = SchemaFactory.createForClass(Address)
