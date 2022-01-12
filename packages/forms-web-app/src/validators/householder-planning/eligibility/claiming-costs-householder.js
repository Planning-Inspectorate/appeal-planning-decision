const { body } = require('express-validator');

const rules = () => {
  return [
    body('claiming-costs-householder')
      .notEmpty()
      .withMessage('Select yes if you are claiming costs as part of your appeal')
      .bail(),
  ];
};

module.exports = {
  rules,
};
