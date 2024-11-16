import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectModel } from "@nestjs/mongoose"
import { I_ModelUser, model_user } from "../user/schemas/user.schema"

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(model_user)
    private readonly userModel: I_ModelUser,
    private readonly jwtService: JwtService
  ) {}
  async signIn(email: string, password: string) {
    const user = await this.userModel.findByEmailAndPassword(email, password)
    if (!user) {
      throw new UnauthorizedException()
    }

    return {
      token: await this.jwtService.signAsync({ data: (user as any)._id }),
      role: (user as any).role
    }
  }
}
