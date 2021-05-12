class ApiResponseError extends Error {
  constructor(code, message, errorResponse) {
    super(message);

    this.code = code;
    this.message = message;
    this.errorResponse = errorResponse;
  }

  get errorMap() {
    return this.errorResponse.errorMap;
  }

  get errorSummary() {
    return this.errorResponse.errors;
  }
}

module.exports = ApiResponseError;
