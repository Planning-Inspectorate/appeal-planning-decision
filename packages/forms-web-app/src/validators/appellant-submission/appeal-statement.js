const { body, checkSchema } = require('express-validator');
const appealStatementSchema = require('./appeal-statement-schema');

const rules = () => {
  return [
    body('does-not-include-sensitive-information')
      .notEmpty()
      .withMessage('Confirm that your statement does not include sensitive information')
      .bail()
      .equals('i-confirm'),

    checkSchema(appealStatementSchema),
  ];
};

module.exports = {
  rules,
};
