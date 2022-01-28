const { body } = require('express-validator');

const rules = () => {
  return [
    body('listed-building')
      .notEmpty()
      .withMessage('Select yes if your appeal about a listed building')
      .bail(),
  ];
};

module.exports = {
  rules,
};
