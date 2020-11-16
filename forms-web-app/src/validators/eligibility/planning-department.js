const { body } = require('express-validator');

const rules = () => {
  return [
    body('local-planning-department')
      .notEmpty()
      .withMessage('You need to provide the local planning department'),
  ];
};

module.exports = {
  rules,
};
