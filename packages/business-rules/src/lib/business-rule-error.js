class BusinessRuleError extends Error {
  constructor(error) {
    super();
    this.name = 'BusinessRuleError';
    this.message = error;
    this.errors = [error];
  }
}

module.exports = BusinessRuleError;
