const { rules } = require('@pins/business-rules');
const { parseISO } = require('date-fns');
const formatDate = require('./format-date-check-your-answers');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { mapTypeCodeToAppealId } = require('@pins/common');

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

/**
 * @param {string} appealType
 * @param {string} enforcementEffectiveDate
 * @param {string} applicationDecisionDate
 * @returns {Date | { date: any; day: string; month: string; year: any; }} returns appeal deadline - note: should return Date as rawDate param set as true
 */
const getDeadlineV2 = (appealType, enforcementEffectiveDate = '', applicationDecisionDate = '') => {
	const deadline =
		appealType === CASE_TYPES.ENFORCEMENT.processCode
			? parseISO(enforcementEffectiveDate)
			: businessRulesDeadline(
					applicationDecisionDate,
					mapTypeCodeToAppealId(appealType),
					null,
					true
				);

	return deadline;
};

module.exports = {
	businessRulesDeadline,
	hasDeadlineDatePassed,
	getDeadlinePeriod,
	getDeadlineV2
};
