type ValidationExceptionParams = {
  message: string;
  violations: any[];
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
 *    throw new ValidationException({
 *      status: 400,
 *      code: 'PAYMENT_FAILED',
 *      body: 'Payment processing failed',
 *      cause: stripeError
 *    });
 * }
 */
export class ValidationException extends Error {
  public readonly status: number;
  public readonly message: string;
  public readonly violations: any[];
  public readonly stack!: string;
  public readonly code?: string;
  public readonly cause?: Error;

  constructor({ message, cause, violations }: ValidationExceptionParams) {
    // -- initialize
    super(message);
    this.status = 400;
    this.code = "VALIDATION_ERROR";
    this.message = message;
    this.cause = cause;
    this.violations = violations;

    // This maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, ValidationException);
  }
}
