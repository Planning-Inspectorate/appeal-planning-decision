const yup = require('yup');
const parseDateString = require('../../../lib/parse-date-string');

require('../business-rules/decision-date');

// const businessRules = yup.object().shape({
//   decisionDate: yup.lazy((decisionDate) =>
//     yup.date().isInThePast(decisionDate).isWithinDecisionDateExpiryPeriod(decisionDate)
//   ),
// });

const businessRules = yup.lazy((decisionDate) =>
  yup.date().isInThePast(decisionDate).isWithinDecisionDateExpiryPeriod(decisionDate)
);

const technicalRules = yup.date().transform(parseDateString).default(null);

module.exports = yup.date().concat(technicalRules).concat(businessRules);
