const { body } = require('express-validator');

const rules = () => {
  return [
    body('appellant-confirmation')
      .notEmpty()
      .withMessage('You need to agree to the declaration')
      .bail()
      .equals('i-agree'),
  ];
};

module.exports = {
  rules,
};
