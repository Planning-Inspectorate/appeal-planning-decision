const { body } = require('express-validator');

const rules = ({ fieldName, emptyError, invalidError, minLength = 1, maxLength = 999 }) => [
  body(fieldName)
    .notEmpty()
    .withMessage(emptyError)
    .bail()
    .isInt({ gt: minLength - 1, lt: maxLength + 1, allow_leading_zeroes: false })
    .withMessage(invalidError),
];

module.exports = {
  rules,
};
