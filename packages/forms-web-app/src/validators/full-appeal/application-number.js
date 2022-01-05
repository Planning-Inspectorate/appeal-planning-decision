const { body } = require('express-validator');

const rulePlanningApplicationNumber = () =>
  body('application-number')
    .notEmpty()
    .withMessage('Enter the original planning application number')
    .bail()
    .isLength({ min: 1, max: 30 })
    .withMessage('The application number must be no more than 30 characters');

const rules = () => {
  return [rulePlanningApplicationNumber()];
};

module.exports = {
  rules,
};
