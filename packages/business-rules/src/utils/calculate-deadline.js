const deadlineDate = require('../rules/appeal/deadline-date');
const { parseISO } = require('date-fns');

const calculateDeadline = {
	householderApplication: (decisionDate) => {
		const numOfWeeksToDeadline = 12;
		const tempDate = new Date(decisionDate);
		tempDate.setDate(tempDate.getDate() + numOfWeeksToDeadline * 7 - 1);
		return tempDate;
	},
	fullAppealApplication: (decisionDate) => {
		const numOfMonthsToDeadline = 6;
		const tempDate = new Date(decisionDate);
		tempDate.setMonth(tempDate.getMonth() + numOfMonthsToDeadline);
		tempDate.setDate(tempDate.getDate() - 1);
		return tempDate;
	},
	businessRulesDeadline: (decisionDate, appealType, applicationDecision) => {
		return deadlineDate(parseISO(decisionDate), appealType, applicationDecision);
	}
};

module.exports = {
	calculateDeadline
};
