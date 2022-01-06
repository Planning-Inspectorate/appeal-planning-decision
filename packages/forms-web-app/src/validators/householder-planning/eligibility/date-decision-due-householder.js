const { body } = require('express-validator');
const { isAfter } = require('date-fns');
const dateInputValidation = require('../../custom/date-input');

const rules = () => [
  ...(dateInputValidation('date-decision-due-householder', 'the Decision Date') || []),
  body('date-decision-due-householder').custom((value, { req }) => {
    const enteredDate = new Date(
      req.body['date-decision-due-householder-year'],
      (parseInt(req.body['date-decision-due-householder-month'], 10) - 1).toString(),
      req.body['date-decision-due-householder-day']
    );

    if (isAfter(enteredDate, new Date())) {
      throw new Error('Date decision due must be today or in the past');
    }

    return true;
  }),
];

module.exports = {
  rules,
};
