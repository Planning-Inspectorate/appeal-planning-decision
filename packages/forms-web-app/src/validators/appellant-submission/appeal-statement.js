const { body, checkSchema } = require('express-validator');
const appealStatementSchema = require('./appeal-statement-schema');

const rules = () => {
  return [
    checkSchema(appealStatementSchema),

    body('does-not-include-sensitive-information')
      .notEmpty()
      .withMessage('Confirm that your statement does not include sensitive information')
      .bail()
      .equals('i-confirm'),
  ];
};

module.exports = {
  rules,
};
