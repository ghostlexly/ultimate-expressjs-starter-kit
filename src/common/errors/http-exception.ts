type HttpExceptionParams = {
  status: number;
  message: string;
  code?: string;
  cause?: Error;
};

/**
 * Advanced custom error class
 * The stack trace is only available in development mode and set automatically.
 * The cause is also only available in development mode but you need to pass the Error instance.
 *
 * @example
 * ```ts
 *   try {
 *    await stripeClient.charges.create({ amount });
 *   } catch (stripeError) {
 *    throw new HttpException({
 *      status: 400,
 *      code: 'PAYMENT_FAILED',
 *      message: 'Payment processing failed',
 *      cause: stripeError
 *    });
 * }
 */
export class HttpException extends Error {
  public readonly status: number;
  public readonly message: string;
  public readonly stack!: string;
  public readonly code?: string;
  public readonly cause?: Error;

  constructor({ status, message, code, cause }: HttpExceptionParams) {
    // -- validate
    if (!status || typeof status !== "number" || status < 100 || status > 599) {
      throw new Error("Invalid status code");
    }

    // -- initialize
    super(message);
    this.status = status;
    this.code = code;
    this.message = message;
    this.cause = cause;

    // This maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, HttpException);
  }

  public static badRequest(
    params: Omit<HttpExceptionParams, "status">
  ): HttpException {
    return new HttpException({ status: 400, ...params });
  }

  public static unauthorized(
    params: Omit<HttpExceptionParams, "status">
  ): HttpException {
    return new HttpException({ status: 401, ...params });
  }

  public static paymentRequired(
    params: Omit<HttpExceptionParams, "status">
  ): HttpException {
    return new HttpException({ status: 402, ...params });
  }

  public static forbidden(
    params: Omit<HttpExceptionParams, "status">
  ): HttpException {
    return new HttpException({ status: 403, ...params });
  }

  public static notFound(
    params: Omit<HttpExceptionParams, "status">
  ): HttpException {
    return new HttpException({ status: 404, ...params });
  }

  public static methodNotAllowed(
    params: Omit<HttpExceptionParams, "status">
  ): HttpException {
    return new HttpException({ status: 405, ...params });
  }

  public static notAcceptable(
    params: Omit<HttpExceptionParams, "status">
  ): HttpException {
    return new HttpException({ status: 406, ...params });
  }

  public static conflict(
    params: Omit<HttpExceptionParams, "status">
  ): HttpException {
    return new HttpException({ status: 409, ...params });
  }

  public static tooManyRequests(
    params: Omit<HttpExceptionParams, "status">
  ): HttpException {
    return new HttpException({ status: 429, ...params });
  }

  public static internalServerError(
    params: Omit<HttpExceptionParams, "status">
  ): HttpException {
    return new HttpException({ status: 500, ...params });
  }

  public static notImplemented(
    params: Omit<HttpExceptionParams, "status">
  ): HttpException {
    return new HttpException({ status: 501, ...params });
  }

  public static badGateway(
    params: Omit<HttpExceptionParams, "status">
  ): HttpException {
    return new HttpException({ status: 502, ...params });
  }

  public static serviceUnavailable(
    params: Omit<HttpExceptionParams, "status">
  ): HttpException {
    return new HttpException({ status: 503, ...params });
  }

  public static gatewayTimeout(
    params: Omit<HttpExceptionParams, "status">
  ): HttpException {
    return new HttpException({ status: 504, ...params });
  }
}
