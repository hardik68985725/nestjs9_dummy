import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from "@nestjs/common"
import { isArray } from "class-validator"
import { Request, Response } from "express"
import { MyResponse } from "../interceptors/transform.interceptor"

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log(__filename, " > catch > ", exception)

    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    const responseFromService = exception.getResponse() as {
      statusCode: number
      message: any
    }

    const myResponse: MyResponse<any> = {
      status: false,
      code: responseFromService.statusCode | 400,
      messages: [responseFromService.message],
      data: null
    }

    if (isArray(responseFromService.message)) {
      myResponse.messages = responseFromService.message
    }

    if (exception.name === "ThrottlerException") {
      myResponse.messages = ["Too Many Requests"]
    }

    response.status(status).json(myResponse)
  }
}
