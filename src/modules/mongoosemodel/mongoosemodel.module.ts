import { Global, Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"

import { model_media, SchemaMedia } from "../media/media.schema"
import { model_user, SchemaUser } from "../user/schemas/user.schema"
import { model_product, SchemaProduct } from "../product/schemas/product.schema"
import { model_order, SchemaOrder } from "../order/schemas/order.schema"

const models = [
  { name: model_media, schema: SchemaMedia },
  { name: model_user, schema: SchemaUser },
  { name: model_product, schema: SchemaProduct },
  { name: model_order, schema: SchemaOrder }
]

@Global()
@Module({
  imports: [MongooseModule.forFeature(models)],
  exports: [MongooseModule]
})
export class MongooseModelModule {}
