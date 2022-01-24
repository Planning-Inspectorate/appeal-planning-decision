const { body } = require('express-validator');

const rules = (fieldName, notEmptyError = 'Select an option', validOptions = ['yes', 'no']) => [
  body(fieldName)
    .notEmpty()
    .withMessage(notEmptyError)
    .bail()
    .isIn(validOptions)
    .withMessage(notEmptyError),
];

module.exports = {
  rules,
};
