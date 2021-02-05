const { body } = require('express-validator');
const { endOfDay, isAfter, isValid, parse } = require('date-fns');

const decisionDateExpiredMessage = 'Decision date expired';

const decisionDateCombiner = (req) => {
  const day = req.body['decision-date-day'];
  const month = req.body['decision-date-month'];
  const year = req.body['decision-date-year'];

  const decisionDate = `${year}-${month}-${day}`;

  req.body['decision-date-full'] = decisionDate;

  return decisionDate;
};

const combinedDecisionDateFieldValidator = (req) => {
  let decisionDate;
  try {
    decisionDate = parse(decisionDateCombiner(req), 'yyyy-MM-dd', new Date());
  } catch (e) {
    throw new Error('You need to provide a date');
  }

  if (!decisionDate || !isValid(decisionDate)) {
    throw new Error('You need to provide a date');
  }

  const today = endOfDay(new Date());

  if (isAfter(decisionDate, today)) {
    throw new Error('You need to provide a date');
  }

  return Promise.resolve(true);
};

const rules = () => {
  return [
    body('decision-date-day').notEmpty(),
    body('decision-date-month').notEmpty(),
    body('decision-date-year').notEmpty().isLength({ min: 4, max: 4 }),
    body('decision-date').custom(
      /* istanbul ignore next */ (_value, { req }) => combinedDecisionDateFieldValidator(req)
    ),
  ];
};

module.exports = {
  combinedDecisionDateFieldValidator,
  decisionDateCombiner,
  decisionDateExpiredMessage,
  rules,
};
