import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"
import { HydratedDocument, Model } from "mongoose"
import { status } from "src/common/enums"
import { Media, model_media } from "src/modules/media/media.schema"

@Schema({
  timestamps: { createdAt: "_created_at", updatedAt: "_updated_at" },
  toObject: { virtuals: false, versionKey: false },
  toJSON: { virtuals: false, versionKey: false }
})
export class Product {
  @Prop({
    trim: true,
    required: true,
    index: true
  })
  product_name: string

  @Prop({
    trim: true,
    required: true,
    type: Types.ObjectId,
    ref: model_media
  })
  product_picture: Types.ObjectId | Media

  @Prop({
    trim: true,
    required: true
  })
  product_description: string

  @Prop({
    trim: true,
    required: true
  })
  product_price: number

  @Prop({
    type: String,
    enum: Object.keys(status),
    trim: true,
    default: status.active
  })
  status?: status
}

export const SchemaProduct = SchemaFactory.createForClass(Product).post(
  ["find", "findOne", "findOneAndUpdate"],
  async function (result) {
    if (!result || !this.mongooseOptions().lean) {
      return
    }
    if (Array.isArray(result)) {
      result.forEach((doc) => delete doc.__v)
      return
    }
    delete result.__v
  }
)
export type document_product = HydratedDocument<Product>
export interface I_ModelProduct extends Model<document_product> {}
export const model_product = Product.name
