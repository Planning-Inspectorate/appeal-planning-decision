const { body } = require('express-validator');

const rulePlanningApplicationNumber = () =>
  body('application-number')
    .notEmpty()
    .withMessage('Enter your planning application number')
    .bail()
    .isLength({ min: 1, max: 30 })
    .withMessage('Planning application number must be 30 characters or fewer');

const rules = () => {
  return [rulePlanningApplicationNumber()];
};

module.exports = {
  rules,
};
