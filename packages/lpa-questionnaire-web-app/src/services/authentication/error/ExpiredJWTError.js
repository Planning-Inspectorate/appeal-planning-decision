module.exports = class ExpiredJWTError extends Error {
  constructor(message, jwtPayload) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.jwtPayload = jwtPayload;
  }
};
