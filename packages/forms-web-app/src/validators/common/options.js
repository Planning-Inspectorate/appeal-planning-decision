const { body } = require('express-validator');

const rules = ({ fieldName, emptyError = null, validOptions = ['yes', 'no'] }) => [
  body(fieldName).custom((value, { req }) => {
    const error = typeof emptyError === 'function' ? emptyError(req) : emptyError;

    if (value && validOptions.includes(value)) {
      return true;
    }

    throw new Error(error || 'Select an option');
  }),
];

module.exports = {
  rules,
};
