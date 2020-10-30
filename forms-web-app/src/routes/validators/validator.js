const { body, validationResult } = require('express-validator');
const moment = require('moment');

const decisionDateCombiner = (value, { req }) => {
  const day = req.body['decision-date-day'];
  const month = req.body['decision-date-month'];
  const year = req.body['decision-date-year'];

  return `${year}-${month}-${day}`;
};

const deadlineDateValidator = (value) => {
  const currentDate = moment();
  const deadlineDate = value.add(12, 'weeks');

  if (deadlineDate.isBefore(currentDate, 'days')) {
    throw new Error('Deadline date has passed');
  } else {
    return value;
  }
};

const decisionDateValidationRules = () => {
  return [
    body('decision-date-day').notEmpty(),
    body('decision-date-month').notEmpty(),
    body('decision-date-year').notEmpty(),
    // body('decision-date-year').custom(decisionDateCombiner).isDate().custom(deadlineDateValidator),
  ];
};

const validator = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  req.body.errors = errors.array().map((err) => {
    return { [err.param]: err.msg };
  });

  return next();
};

module.exports = {
  decisionDateCombiner,
  deadlineDateValidator,
  decisionDateValidationRules,
  validator,
};
