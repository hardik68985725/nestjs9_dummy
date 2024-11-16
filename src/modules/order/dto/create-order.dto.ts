import { OmitType } from "@nestjs/mapped-types"
import { OrderDto } from "."

export class CreateOrderDto extends OmitType(OrderDto, []) {}
