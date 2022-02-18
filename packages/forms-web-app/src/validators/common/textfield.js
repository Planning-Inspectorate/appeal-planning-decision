const { body } = require('express-validator');

const rules = ({
  fieldName,
  targetFieldName,
  emptyError,
  tooLongError,
  targetFieldValue = 'no',
  maxLength = 255,
}) => {
  const rule = body(fieldName);

  if (targetFieldName && targetFieldValue) {
    rule.if(body(targetFieldName).matches(targetFieldValue));
  }

  rule
    .notEmpty()
    .withMessage(emptyError)
    .bail()
    .isLength({ min: 1, max: maxLength })
    .withMessage(tooLongError.replace('$maxLength', maxLength));

  return [rule];
};

module.exports = {
  rules,
};
