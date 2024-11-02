type HttpErrorParams = {
  status: number;
  body: any | string;
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
 *    throw new HttpError({
 *      status: 400,
 *      code: 'PAYMENT_FAILED',
 *      body: 'Payment processing failed',
 *      cause: stripeError
 *    });
 * }
 */
export class HttpError extends Error {
  readonly status: number;
  readonly body: any;
  readonly stack: string;
  readonly code?: string;
  readonly cause?: Error;

  constructor({ status, body, code, cause }: HttpErrorParams) {
    // -- validate
    if (!status || typeof status !== "number" || status < 100 || status > 599) {
      throw new Error("Invalid status code");
    }

    // -- normalize body
    // if body is a string, convert it to an object with a message property
    const normalizedBody = typeof body === "string" ? { message: body } : body;

    // -- initialize
    super(typeof body === "string" ? body : body.message);
    this.status = status;
    this.code = code;
    this.body = normalizedBody;
    this.cause = cause;

    // This maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, HttpError);
  }

  toJSON() {
    const isDev = process.env.NODE_ENV === "development";

    return {
      status: this.status,
      code: this.code,
      stack: isDev ? this.stack : undefined,
      cause: isDev ? this.cause : undefined,
      ...this.body,
    };
  }

  static BadRequest(params: Omit<HttpErrorParams, "status">) {
    return new HttpError({ status: 400, ...params });
  }

  static Unauthorized(params: Omit<HttpErrorParams, "status">) {
    return new HttpError({ status: 401, ...params });
  }

  static PaymentRequired(params: Omit<HttpErrorParams, "status">) {
    return new HttpError({ status: 402, ...params });
  }

  static Forbidden(params: Omit<HttpErrorParams, "status">) {
    return new HttpError({ status: 403, ...params });
  }

  static NotFound(params: Omit<HttpErrorParams, "status">) {
    return new HttpError({ status: 404, ...params });
  }

  static MethodNotAllowed(params: Omit<HttpErrorParams, "status">) {
    return new HttpError({ status: 405, ...params });
  }

  static NotAcceptable(params: Omit<HttpErrorParams, "status">) {
    return new HttpError({ status: 406, ...params });
  }

  static Conflict(params: Omit<HttpErrorParams, "status">) {
    return new HttpError({ status: 409, ...params });
  }

  static TooManyRequests(params: Omit<HttpErrorParams, "status">) {
    return new HttpError({ status: 429, ...params });
  }

  static InternalServerError(params: Omit<HttpErrorParams, "status">) {
    return new HttpError({ status: 500, ...params });
  }

  static NotImplemented(params: Omit<HttpErrorParams, "status">) {
    return new HttpError({ status: 501, ...params });
  }

  static BadGateway(params: Omit<HttpErrorParams, "status">) {
    return new HttpError({ status: 502, ...params });
  }

  static ServiceUnavailable(params: Omit<HttpErrorParams, "status">) {
    return new HttpError({ status: 503, ...params });
  }

  static GatewayTimeout(params: Omit<HttpErrorParams, "status">) {
    return new HttpError({ status: 504, ...params });
  }
}
