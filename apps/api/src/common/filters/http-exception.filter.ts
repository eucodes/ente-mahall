import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import type { Response } from "express";
import type { ApiErrorResponse } from "@mahalle/types";

/**
 * Catches every exception thrown in a request lifecycle and normalizes it
 * into the shared ApiErrorResponse envelope. Unknown/unexpected errors are
 * logged with full detail server-side but only ever return a generic message
 * to the client — never a stack trace or internal error string.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const message =
        typeof body === "string" ? body : ((body as { message?: string | string[] }).message ?? exception.message);

      const payload: ApiErrorResponse = {
        success: false,
        error: {
          code: HttpStatus[status] ?? "ERROR",
          message: Array.isArray(message) ? message.join(", ") : message,
          details: typeof body === "object" ? (body as Record<string, unknown>).errors : undefined
        }
      };
      response.status(status).json(payload);
      return;
    }

    this.logger.error(exception instanceof Error ? exception.stack : exception);

    const payload: ApiErrorResponse = {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong. Please try again later."
      }
    };
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(payload);
  }
}
