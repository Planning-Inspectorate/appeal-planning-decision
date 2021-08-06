function createYupError(errorMessage) {
  return this.createError({
    path: this.path,
    message: `${this.path} ${errorMessage}`,
  });
}

module.exports = createYupError;
