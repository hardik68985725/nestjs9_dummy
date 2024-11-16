import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"

export interface MyResponse<T> {
  status: boolean
  code: number
  messages: Array<string>
  data: T
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, MyResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<MyResponse<T>> {
    return next.handle().pipe(
      map((res: any) => {
        const response: any = {
          status: true,
          code: 200,
          messages: [],
          data: res
        }
        if (res && res.message && res.message.length) {
          response.messages.push(res.message)
          response.data = null
          if (res.data) {
            response.data = res.data
          }
        }
        return response
      })
    )
  }
}
