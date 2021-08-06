class BusinessRulesError extends Error {
  constructor(error) {
    super();
    this.name = 'BusinessRulesError';
    this.message = error;
    this.errors = [error];
  }
}

module.exports = BusinessRulesError;
