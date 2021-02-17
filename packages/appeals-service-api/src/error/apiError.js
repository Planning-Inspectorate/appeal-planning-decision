class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }

  static appealNotFound(id) {
    return new ApiError(404, { errors: [`The appeal ${id} was not found`] });
  }

  static notSameId() {
    return new ApiError(409, {
      errors: ['The provided id in path must be the same as the appeal id in the request body'],
    });
  }

  static appealAlreadySubmitted() {
    return new ApiError(409, { errors: ['Cannot update appeal that is already SUBMITTED'] });
  }
}

module.exports = ApiError;
