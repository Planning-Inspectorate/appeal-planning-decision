const { body } = require('express-validator');

const validOptions = ['yes', 'no'];

const rules = (fieldName, notEmptyError = 'Select an option') => [
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
