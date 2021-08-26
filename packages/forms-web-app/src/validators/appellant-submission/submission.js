const { body } = require('express-validator');

const rules = () => {
  return [
    body('appellant-confirmation')
      .notEmpty()
      .withMessage('Select to confirm you agree')
      .bail()
      .equals('i-agree'),
  ];
};

module.exports = {
  rules,
};
