const { body } = require('express-validator');

const rules = () => {
  return [
    body('appellant-confirmation')
      .notEmpty()
      .withMessage('Confirm that you agree with the terms and conditions')
      .bail()
      .equals('i-agree'),
  ];
};

module.exports = {
  rules,
};
