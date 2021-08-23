/**
 * Error thrown during authentication when the token is expired.
 * @type {ExpiredTokenError}
 */
module.exports = class ExpiredTokenError extends Error {
  constructor(message, tokenPayload) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.tokenPayload = tokenPayload;
  }
};
