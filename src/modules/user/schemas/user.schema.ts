import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Model, Types } from "mongoose"
import { compareSync, hashSync } from "bcrypt"
import { status, user_roles } from "src/common/enums"
import { SchemaUserDealer, UserDealer } from "./userdealer.schema"
import { SchemaUserProfile, UserProfile } from "./userprofile.schema"

@Schema({
  timestamps: { createdAt: "_created_at", updatedAt: "_updated_at" },
  toObject: { virtuals: false, versionKey: false },
  toJSON: {
    virtuals: false,
    versionKey: false
    /* transform: (doc, ret, options) => {
      console.log(__filename, " > toJSON > transform >")
      delete ret.__v
      return ret
    } */
  },
  methods: {
    async isValidPassword(this: document_user, password: string) {
      return await compareSync(password, this.password)
    }
  },
  statics: {
    async findByEmailAndPassword(
      this: I_ModelUser,
      email: string,
      password: string
    ) {
      const user = await this.findOne({ email })
        .select("password role status")
        .exec()

      if (!user) {
        return false
      }

      if (!(await user.isValidPassword(password))) {
        return false
      }

      if (user.status !== status.active) {
        return false
      }

      return { _id: user._id, role: user.role }
    },
    async doesEmailExists(this: I_ModelUser, email: string) {
      return (
        ((await this.count({ email }).lean().exec()) as unknown as number) > 0
      )
    },
    async doesEmailExistsWithId(this: I_ModelUser, _id: string, email: string) {
      const user = await this.findOne({ email })
        .select(`_id email`)
        .lean()
        .exec()

      if (user) {
        if (_id === user._id.toString()) {
          return false
        }
        return true
      }
      return false
    }
  }
})
export class User {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    trim: true,
    required: true
  })
  parent_user: Types.ObjectId | User

  @Prop({
    type: String,
    trim: true,
    required: true,
    index: true,
    unique: true
  })
  email: string

  @Prop({
    type: String,
    trim: true,
    required: true,
    select: false
  })
  password: string

  @Prop({
    type: String,
    enum: Object.keys(user_roles),
    trim: true,
    default: user_roles.sales_officer,
    immutable: true
  })
  role?: user_roles

  @Prop({
    type: String,
    enum: Object.keys(status),
    trim: true,
    default: status.active
  })
  status?: status

  @Prop({ type: SchemaUserProfile })
  profile?: UserProfile

  @Prop({ type: SchemaUserDealer })
  dealer?: UserDealer

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    trim: true,
    required: true,
    immutable: true
  })
  created_by: Types.ObjectId | User

  isValidPassword: (password: string) => Promise<boolean>
}

export const SchemaUser = SchemaFactory.createForClass(User)
  .pre("save", async function (next: Function) {
    if (this.isModified("password")) {
      this.password = hashSync(this.password, 2)
    }

    next()
  })
  .post(["find", "findOne", "findOneAndUpdate"], async function (result) {
    if (!result || !this.mongooseOptions().lean) {
      return
    }
    if (Array.isArray(result)) {
      result.forEach((doc) => delete doc.__v)
      return
    }
    delete result.__v
  })

SchemaUser.virtual("set_created_by").set(function (
  _created_by_id: Types.ObjectId | User
) {
  if (this.isNew) {
    this.created_by = _created_by_id
  }
})

export type document_user = HydratedDocument<User>

export interface I_ModelUser extends Model<document_user> {
  findByEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<document_user | boolean>
  doesEmailExists: (email: string) => Promise<boolean>
  doesEmailExistsWithId: (_id: string, email: string) => Promise<number>
}

export const model_user = User.name
