const { body } = require('express-validator');

const rules = () => {
  return [
    body('local-planning-department')
      .notEmpty()
      .withMessage('Select the local planning department from the list'),
  ];
};

module.exports = {
  rules,
};
