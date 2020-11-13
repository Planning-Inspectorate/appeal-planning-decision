const { body } = require('express-validator');
const { addWeeks, endOfDay, isAfter, isBefore, isValid, parse } = require('date-fns');

const decisionDateExpiredMessage = 'Decision date expired';

const decisionDateCombiner = (req) => {
  const day = req.body['decision-date-day'];
  const month = req.body['decision-date-month'];
  const year = req.body['decision-date-year'];

  return `${year}-${month}-${day}`;
};

const getDeadlineDate = (decisionDate) => {
  return addWeeks(endOfDay(decisionDate), 12);
};

const combinedDecisionDateFieldValidator = (req) => {
  let decisionDate;
  try {
    decisionDate = parse(decisionDateCombiner(req), 'yyyy-MM-dd', new Date());
  } catch (e) {
    throw new Error(JSON.stringify({ msg: 'Invalid date' }));
  }

  if (!decisionDate || !isValid(decisionDate)) {
    throw new Error(JSON.stringify({ msg: 'Invalid date' }));
  }

  const today = endOfDay(new Date());
  const deadlineDate = getDeadlineDate(decisionDate);

  if (isAfter(decisionDate, today)) {
    throw new Error(JSON.stringify({ msg: 'Invalid date' }));
  }

  if (isBefore(getDeadlineDate(decisionDate), today)) {
    throw new Error(JSON.stringify({ msg: decisionDateExpiredMessage, deadlineDate }));
  }

  return Promise.resolve(true);
};

const rules = () => {
  return [
    body('decision-date-day').notEmpty(),
    body('decision-date-month').notEmpty(),
    body('decision-date-year').notEmpty().isLength({ min: 4, max: 4 }),
    body('decision-date').custom((_value, { req }) => combinedDecisionDateFieldValidator(req)),
  ];
};

module.exports = {
  combinedDecisionDateFieldValidator,
  decisionDateCombiner,
  decisionDateExpiredMessage,
  getDeadlineDate,
  rules,
};
