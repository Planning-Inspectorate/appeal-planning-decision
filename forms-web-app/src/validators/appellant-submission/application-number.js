const { body } = require('express-validator');

const rulePlanningApplicationNumber = () =>
  body('application-number').notEmpty().withMessage('Enter your planning application number');

const rules = () => {
  return [rulePlanningApplicationNumber()];
};

module.exports = {
  rules,
};
