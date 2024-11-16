import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { CreateProductDto, FindProductDto, UpdateProductDto } from "./dto"
import { I_ModelProduct, model_product } from "./schemas/product.schema"

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(model_product) private readonly productModel: I_ModelProduct
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.productModel.create(createProductDto)
      return { product: product._id }
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new BadRequestException(error.errors)
      }

      throw new ServiceUnavailableException()
    }
  }

  async findAll(findProductDto: FindProductDto) {
    const skip: number = findProductDto.limit * (findProductDto.page_no - 1)
    const sort: any = {}
    sort[findProductDto.sort_by] = findProductDto.sort_type
    const where = {}
    const total_no_of_records: number = await this.productModel.countDocuments(
      where
    )

    if (findProductDto.limit < 0) {
      findProductDto.limit = total_no_of_records
    }

    const paging = {
      total_no_of_records: total_no_of_records,
      total_no_of_pages:
        findProductDto.limit > 0
          ? Math.ceil(total_no_of_records / findProductDto.limit)
          : 0
    }

    let records: Array<unknown> = []
    if (findProductDto.page_no < paging.total_no_of_pages + 1) {
      const query = this.productModel
        .find()
        .lean()
        .select(findProductDto.fields)
        .where(where)
        .populate({
          path: "product_picture",
          transform: (doc) => (doc === null ? "" : doc.media_file_url)
        })
        .skip(skip)
        .limit(findProductDto.limit)
        .sort(sort)
      records = await query.exec()
    }
    return { paging, records }
  }

  async findOne(id: string) {
    try {
      const product = await this.productModel
        .findById(id)
        .select(
          `
          product_name
          product_description
          product_price
          status
        `
        )
        .populate({
          path: "product_picture",
          transform: (doc) =>
            doc === null
              ? {}
              : {
                  _id: doc._id,
                  media_file_url: doc.media_file_url,
                  thumbnail: doc.thumbnail
                }
        })

      if (!product) {
        throw new NotFoundException()
      }
      return product
    } catch (error) {
      console.log(__filename, " > findOne > catch > ", error)
      throw new NotFoundException()
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productModel.findByIdAndUpdate(
        id,
        updateProductDto,
        {
          new: true
        }
      )
      if (!product) {
        throw new NotFoundException()
      }
      return product
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async remove(id: string) {
    try {
      const product = await this.productModel.findByIdAndDelete(id)
      if (!product) {
        throw new NotFoundException()
      }
      return { id }
    } catch (error) {
      throw new NotFoundException()
    }
  }
}
