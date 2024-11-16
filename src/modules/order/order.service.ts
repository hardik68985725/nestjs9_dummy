import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { I_ModelOrder, model_order } from "./schemas/order.schema"
import {
  ChangeStatusDto,
  DispatchOrderDto,
  FindOrderDto,
  UpdateOrderDto
} from "./dto"

import { ProductService } from "../product/product.service"
import { UserService } from "../user/user.service"
import { order_status, user_roles } from "src/common/enums"

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(model_order) private readonly orderModel: I_ModelOrder,
    private readonly userService: UserService,
    private readonly productService: ProductService
  ) {}

  async create(_data: any, _SignedInUserId: string) {
    try {
      const SignedInUser = await this.userService.findOne(_SignedInUserId)
      const SignedInUserRole = SignedInUser.role as unknown as user_roles
      if (
        ![
          user_roles.owner,
          user_roles.sales_officer,
          user_roles.dealer
        ].includes(SignedInUserRole)
      ) {
        throw new ForbiddenException()
      }

      console.log("SignedInUserRole >", SignedInUserRole)
      if (SignedInUserRole === user_roles.dealer) {
        _data = { ..._data, dealer: _SignedInUserId }
      } else if (!_data.dealer || _data.dealer.toString().trim().length === 0) {
        throw new BadRequestException("required_dealer")
      } else {
        try {
          const DealerUser = await this.userService.findOne(_data.dealer)
          if (DealerUser.role !== user_roles.dealer) {
            throw new BadRequestException("invalid_dealer_user")
          }
        } catch (error) {
          throw new BadRequestException("invalid_dealer_user")
        }
      }

      const product = await this.productService.findOne(_data.product)
      const order = await this.orderModel.create({
        ..._data,
        order_time_product_price: product.product_price
      })
      return { order: order._id }
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new BadRequestException(error.errors)
      }
      if (error.name === "BadRequestException") {
        throw new BadRequestException(error.message)
      }

      console.log("error -----", error)
      throw new ServiceUnavailableException()
    }
  }

  async findAll(findOrderDto: FindOrderDto, _SignedInUserId: string) {
    const SignedInUser = await this.userService.findOne(_SignedInUserId)
    const SignedInUserRole = SignedInUser.role as unknown as user_roles

    const skip: number = findOrderDto.limit * (findOrderDto.page_no - 1)
    const sort: any = {}
    sort[findOrderDto.sort_by] = findOrderDto.sort_type
    const where: Record<string, any> = {}

    // if (SignedInUserRole !== user_roles.owner) {
    if (![user_roles.owner, user_roles.dispatcher].includes(SignedInUserRole)) {
      where.$or = [{ created_by: _SignedInUserId }, { dealer: _SignedInUserId }]
    }

    if (user_roles.dispatcher === SignedInUserRole) {
      where.$or = [
        { "dispatch_details.dispatched_by": null },
        { "dispatch_details.dispatched_by": _SignedInUserId }
      ]
    }

    const total_no_of_records: number = await this.orderModel.countDocuments(
      where
    )
    const paging = {
      total_no_of_records: total_no_of_records,
      total_no_of_pages: Math.ceil(total_no_of_records / findOrderDto.limit)
    }

    let records: Array<unknown> = []
    if (findOrderDto.page_no < paging.total_no_of_pages + 1) {
      const query = this.orderModel
        .find()
        .lean()
        .select(findOrderDto.fields)
        .populate([
          {
            path: "dealer",
            select: `
            email
            profile.first_name
            profile.last_name
            profile.mobile_phone_number
          `
          },
          {
            path: "product",
            select: `
            product_name
            product_picture
            product_description
            product_price
            status
          `
          }
        ])
        .where(where)
        .skip(skip)
        .limit(findOrderDto.limit)
        .sort(sort)
      records = await query.exec()
    }

    return { paging, records }
  }

  async findOne(id: string) {
    try {
      const order = await this.orderModel
        .findById(id)
        .select(
          `
          quantity
          dealer
          address
          dispatch_details
          created_by
          status
        `
        )
        .populate({
          path: "product",
          select: `
            product_name
            product_picture
            product_description
            product_price
            status
          `
        })
      if (!order) {
        throw new NotFoundException()
      }
      return order
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.orderModel.findByIdAndUpdate(
        id,
        updateOrderDto,
        {
          new: true
        }
      )
      if (!order) {
        throw new NotFoundException()
      }
      return order
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async remove(id: string) {
    try {
      const order = await this.orderModel.findByIdAndDelete(id)
      if (!order) {
        throw new NotFoundException()
      }
      return { id }
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async change_status(changeStatusDto: ChangeStatusDto) {
    try {
      const order = await this.orderModel.findByIdAndUpdate(
        changeStatusDto.id,
        {
          status: changeStatusDto.status
        }
      )
      if (!order) {
        throw new NotFoundException()
      }
      return { message: "Success" }
    } catch (error) {
      console.log("change_status > error -----", error)
      throw new NotFoundException()
    }
  }

  async dispatch_order(
    id: string,
    dispatchOrderDto: DispatchOrderDto,
    _SignedInUserId: string
  ) {
    try {
      const SignedInUser = await this.userService.findOne(_SignedInUserId)
      const SignedInUserRole = SignedInUser.role as unknown as user_roles
      if (
        ![user_roles.owner, user_roles.dispatcher].includes(SignedInUserRole)
      ) {
        throw new ForbiddenException()
      }

      const order = await this.orderModel.findByIdAndUpdate(id, {
        dispatch_details: {
          ...dispatchOrderDto,
          status: order_status.approved,
          dispatched_by: _SignedInUserId
        }
      })
      if (!order) {
        throw new NotFoundException()
      }
      return { message: "Success" }
    } catch (error) {
      console.log("dispatch_order > error -----", error)
      throw new NotFoundException()
    }
  }
}
