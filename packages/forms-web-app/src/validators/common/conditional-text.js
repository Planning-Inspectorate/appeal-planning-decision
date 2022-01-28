const { body } = require('express-validator');

const rules = ({
  fieldName,
  targetFieldName,
  emptyError,
  tooLongError,
  targetFieldValue = 'no',
  maxLength = 255,
}) => [
  body(fieldName)
    .if(body(targetFieldName).matches(targetFieldValue))
    .notEmpty()
    .withMessage(emptyError)
    .bail()
    .isLength({ min: 1, max: maxLength })
    .withMessage(tooLongError.replace('$maxLength', maxLength)),
];

module.exports = {
  rules,
};
