import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Model, Types } from "mongoose"
import { order_status } from "src/common/enums"
import {
  model_product,
  Product
} from "src/modules/product/schemas/product.schema"
import { Address, SchemaAddress } from "src/modules/user/schemas/address.schema"
import { model_user, User } from "src/modules/user/schemas/user.schema"
import {
  DispatchDetails,
  SchemaDispatchDetails
} from "./dispatchdetails.schema"

@Schema({
  timestamps: { createdAt: "_created_at", updatedAt: "_updated_at" },
  toObject: { virtuals: false, versionKey: false },
  toJSON: { virtuals: false, versionKey: false },
  methods: {},
  statics: {}
})
export class Order {
  @Prop({
    type: Types.ObjectId,
    ref: model_product,
    trim: true,
    required: true,
    immutable: true
  })
  product: Types.ObjectId | Product

  @Prop({
    trim: true,
    required: true
  })
  quantity: number

  @Prop({
    trim: true,
    required: true
  })
  order_time_product_price: number

  @Prop({
    type: Types.ObjectId,
    ref: model_user,
    trim: true,
    required: true,
    immutable: true
  })
  dealer: Types.ObjectId | User

  @Prop({
    type: SchemaAddress,
    required: true
  })
  address: Address

  @Prop({ type: SchemaDispatchDetails })
  dispatch_details?: DispatchDetails

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    trim: true,
    required: true,
    immutable: true
  })
  created_by: Types.ObjectId | User

  @Prop({
    type: String,
    enum: Object.keys(order_status),
    trim: true,
    default: order_status.inprogress
  })
  status?: order_status
}

export const SchemaOrder = SchemaFactory.createForClass(Order)

SchemaOrder.virtual("set_created_by").set(function (
  _created_by_id: Types.ObjectId | User
) {
  if (this.isNew) {
    this.created_by = _created_by_id
  }
})

export type document_order = HydratedDocument<Order>
export interface I_ModelOrder extends Model<document_order> {}
export const model_order = Order.name
