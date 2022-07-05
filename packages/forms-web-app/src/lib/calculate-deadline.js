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
	businessRulesDeadline: (decisionDate, appealType, applicationDecision, rawDate = false) => {
		const deadlineDate = rules.appeal.deadlineDate(
			parseISO(decisionDate),
			appealType,
			applicationDecision
		);

		return rawDate ? deadlineDate : formatDate(deadlineDate);
	},
	hasDeadlineDatePassed: (decisionDate, appealType, applicationDecision) => {
		const deadlineDate = calculateDeadline.businessRulesDeadline(
			decisionDate,
			appealType,
			applicationDecision,
			true
		);
		const currentDate = new Date();
		if (currentDate > deadlineDate) {
			return true;
		}
		return false;
	},
	getDeadlinePeriod: (appealType, applicationDecision) => {
		return rules.appeal.deadlinePeriod(appealType, applicationDecision);
	}
};

module.exports = {
	calculateDeadline
};
