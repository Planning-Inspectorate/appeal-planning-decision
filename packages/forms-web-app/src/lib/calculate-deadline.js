const { rules } = require('@pins/business-rules');
const { parseISO } = require('date-fns');
const formatDate = require('./format-date-check-your-answers');

const calculateDeadline = {
  householderApplication: (decisionDate) => {
    const numOfWeeksToDeadline = 12;
    const tempDate = new Date(decisionDate);
    tempDate.setDate(tempDate.getDate() + numOfWeeksToDeadline * 7 - 1);
    return formatDate(tempDate);
  },
  fullAppealApplication: (decisionDate) => {
    const numOfMonthsToDeadline = 6;
    const tempDate = new Date(decisionDate);
    tempDate.setMonth(tempDate.getMonth() + numOfMonthsToDeadline);
    tempDate.setDate(tempDate.getDate() - 1);
    return formatDate(tempDate);
  },
  businessRulesDeadline: (decisionDate, appealType, applicationDecision) => {
    const deadlineDate = rules.appeal.deadlineDate(
      parseISO(decisionDate),
      appealType,
      applicationDecision
    );

    return formatDate(deadlineDate);
  },
};

module.exports = {
  calculateDeadline,
};
