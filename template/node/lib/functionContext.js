module.exports = class FunctionContext {
  constructor() {
    this.httpHeaders = {};
    this.httpStatus = 200;
  }

  /* The methods below exist for compatibility with the official node12 template */
  // eslint-disable-next-line class-methods-use-this
  fail(value) {
    return Promise.reject(value);
  }

  headers(value) {
    if (!value) {
      return this.httpHeaders;
    }

    this.httpHeaders = value;
    return this;
  }

  status(value) {
    if (!value) {
      return this.httpStatus;
    }

    this.httpStatus = value;
    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  async succeed(value) {
    return value;
  }
};
