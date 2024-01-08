const { rules } = require('@pins/business-rules');
const { parseISO } = require('date-fns');
const formatDate = require('./format-date-check-your-answers');

// TODO: consolidate into business-rules/src/utils/calculate-deadline.js

const businessRulesDeadline = (decisionDate, appealType, applicationDecision, rawDate = false) => {
	const deadlineDate = rules.appeal.deadlineDate(
		parseISO(decisionDate),
		appealType,
		applicationDecision
	);

	return rawDate ? deadlineDate : formatDate(deadlineDate);
};
const hasDeadlineDatePassed = (decisionDate, appealType, applicationDecision) => {
	const deadlineDate = businessRulesDeadline(decisionDate, appealType, applicationDecision, true);
	const currentDate = new Date();
	if (currentDate > deadlineDate) {
		return true;
	}
	return false;
};
const getDeadlinePeriod = (appealType, applicationDecision) => {
	return rules.appeal.deadlinePeriod(appealType, applicationDecision);
};

module.exports = {
	businessRulesDeadline,
	hasDeadlineDatePassed,
	getDeadlinePeriod
};
