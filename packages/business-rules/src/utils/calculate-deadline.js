const deadlineDate = require('../rules/appeal/deadline-date');
const { parseISO } = require('date-fns');

const calculateDeadline = {
	businessRulesDeadline: (decisionDate, appealType, applicationDecision) => {
		return deadlineDate(parseISO(decisionDate), appealType, applicationDecision);
	}
};

module.exports = {
	calculateDeadline
};
