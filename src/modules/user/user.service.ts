import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { hashSync } from "bcrypt"
import { user_roles } from "src/common/enums"
import { get_random_number } from "src/common/helpers/function.helper"
import {
  ChangeStatusDto,
  FindUserDto,
  SaveProfileDto,
  UpdateUserDto
} from "./dto"
import { I_ModelUser, model_user } from "./schemas/user.schema"

@Injectable()
export class UserService {
  constructor(
    @InjectModel(model_user) private readonly userModel: I_ModelUser
  ) {}

  async create(_data: any) {
    await this.userModel.findOneAndRemove({ email: _data.email }) // REMOVE THIS IN PRODUCTION
    if (await this.userModel.doesEmailExists(_data.email)) {
      throw new BadRequestException("already_exist_email")
    }

    try {
      const password: string = get_random_number(10000000, 99999999).toString()
      _data.password = password
      const user = await this.userModel.create(_data)
      return { user: user._id }
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new BadRequestException(error.errors)
      }

      throw new ServiceUnavailableException()
    }
  }

  async get_signed_user_detials(id: string) {
    try {
      const user = await this.userModel.findById(id).select(`role -_id`).exec()
      if (!user) {
        throw new NotFoundException()
      }

      return user
    } catch (error) {
      console.log("get_signed_user_detials > error -----", error)
      throw new NotFoundException()
    }
  }

  async findAll(findUserDto: FindUserDto, _SignedInUserId: string) {
    const skip: number = findUserDto.limit * (findUserDto.page_no - 1)
    const sort: any = {}
    sort[findUserDto.sort_by] = findUserDto.sort_type
    const where: Record<string, any> = {
      _id: { $ne: _SignedInUserId }
    }

    const user = await this.userModel.findById(_SignedInUserId).select(`role`)
    if (user_roles.owner !== user?.role) {
      where.parent_user = _SignedInUserId
    }

    const total_no_of_records: number = await this.userModel.countDocuments(
      where
    )
    const paging = {
      total_no_of_records: total_no_of_records,
      total_no_of_pages: Math.ceil(total_no_of_records / findUserDto.limit)
    }

    let records: Array<unknown> = []
    if (findUserDto.page_no < paging.total_no_of_pages + 1) {
      const query = this.userModel
        .find()
        .lean()
        .select(findUserDto.fields)
        .where(where)
        .populate({
          path: "profile.profile_picture",
          transform: (doc) => (doc === null ? "" : doc.media_file_url)
        })
        .skip(skip)
        .limit(findUserDto.limit)
        .sort(sort)
      records = await query.exec()
    }

    return { paging, records }
  }

  async findOne(id: string) {
    try {
      const user = await this.userModel
        .findById(id)
        .select(
          `
          email
          role
          status
          parent_user
          profile.mobile_phone_number
          profile.profile_picture
          profile.first_name
          profile.last_name
          profile.birth_date
          profile.address.address_line_1
          profile.address.village_town_city
          profile.address.taluka
          profile.address.district
          profile.address.pin_code
          profile.address.state
        `
        )
        .populate({
          path: "profile.profile_picture",
          transform: (doc) => (doc === null ? "" : doc.media_file_url)
        })

      if (!user) {
        throw new NotFoundException()
      }
      return user
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true
      })
      if (!user) {
        throw new NotFoundException()
      }
      return user
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userModel.findByIdAndDelete(id)
      if (!user) {
        throw new NotFoundException()
      }
      return { id }
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async profile(id: string) {
    try {
      const user = await this.userModel
        .findById(id)
        .select(
          `
          email
          role
          profile.mobile_phone_number
          profile.profile_picture
          profile.first_name
          profile.last_name
          profile.birth_date
          profile.address.address_line_1
          profile.address.village_town_city
          profile.address.taluka
          profile.address.district
          profile.address.pin_code
          profile.address.state
        `
        )
        .populate({
          path: "profile.profile_picture",
          transform: (doc) =>
            doc === null
              ? {}
              : {
                  _id: doc._id,
                  media_file_url: doc.media_file_url,
                  thumbnail: doc.thumbnail
                }
        })

      if (!user) {
        throw new NotFoundException()
      }
      return user
    } catch (error) {
      throw new NotFoundException()
    }
  }

  async save_profile(id: string, saveProfileDto: SaveProfileDto) {
    if (
      saveProfileDto.email &&
      saveProfileDto.password &&
      !(await this.userModel.findByEmailAndPassword(
        saveProfileDto.email,
        saveProfileDto.password
      ))
    ) {
      throw new ForbiddenException()
    }

    if (
      id &&
      saveProfileDto.email &&
      (await this.userModel.doesEmailExistsWithId(id, saveProfileDto.email))
    ) {
      throw new BadRequestException("already_exist_email")
    }

    delete saveProfileDto.password
    if (saveProfileDto.new_password && saveProfileDto.new_password.length > 0) {
      saveProfileDto.password = hashSync(saveProfileDto.new_password, 2)
    }

    try {
      const user = await this.userModel.findByIdAndUpdate(id, saveProfileDto, {
        new: true
      })
      if (!user) {
        throw new NotFoundException()
      }
      return user
      return {}
    } catch (error) {
      console.log("save_profile > error -----", error)
      throw new NotFoundException()
    }
  }

  async get_user_of_role(role: user_roles) {
    const where: Record<string, any> = {}
    where.status = "active"
    where.role = "owner"
    if (role === user_roles.area_marketing_head) {
      where.role = "marketing_head"
    } else if (role === user_roles.sales_officer) {
      where.role = "area_marketing_head"
    } else if (role === user_roles.dealer) {
      where.role = "sales_officer"
    }
    const query = this.userModel
      .find()
      .lean()
      .select(
        `
        email
        profile.first_name
        profile.last_name
        role
        `
      )
      .where(where)
      .sort({ _created_at: 1 })

    return await query.exec()
  }

  async get_users_has_role(role: user_roles, _SignedInUserId: string) {
    const _SignedInUserData = await this.findOne(_SignedInUserId)
    const where: Record<string, any> = {}
    where.status = "active"
    where.role = role
    if (_SignedInUserData.role === user_roles.sales_officer) {
      where.parent_user = _SignedInUserId
    }
    const query = this.userModel
      .find()
      .lean()
      .select(
        `
        email
        profile.first_name
        profile.last_name
        `
      )
      .where(where)
      .sort({ _created_at: 1 })

    return await query.exec()
  }

  async change_status(changeStatusDto: ChangeStatusDto) {
    try {
      const user = await this.userModel.findByIdAndUpdate(changeStatusDto.id, {
        status: changeStatusDto.status
      })
      if (!user) {
        throw new NotFoundException()
      }
      return { message: "Success" }
    } catch (error) {
      console.log("change_status > error -----", error)
      throw new NotFoundException()
    }
  }
}
