import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from "@nestjs/common";


import { Request, Response } from "express"

@Catch(HttpException)
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>()
        const response = ctx.getResponse<Response>()
        const status = exception.getStatus();
        const errorResponse = exception.getResponse()
        this.logger.error(`Error occured on ${request.url}: ${JSON.stringify(errorResponse)}`, exception.stack)

        response.status(status).json({
            status: 'error',
            message: exception.message,
            stack: exception.stack
        })

    }
}