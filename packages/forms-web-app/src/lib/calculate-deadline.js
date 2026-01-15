const { rules } = require('@pins/business-rules');
const { parseISO, endOfDay, addDays, subDays } = require('date-fns');
const formatDate = require('./format-date-check-your-answers');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { mapTypeCodeToAppealId } = require('@pins/common');
const { utcToZonedTime, zonedTimeToUtc } = require('date-fns-tz');
const targetTimezone = 'Europe/London';

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
 * @param {string} enforcementEffectiveDate
 * @param {boolean} hasContactedPlanningInspectorate
 * @returns {Date | { date: any; day: string; month: string; year: any; }} returns appeal deadline - note: should return Date as rawDate param set as true
 */
const enforcementNoticeDeadline = (enforcementEffectiveDate, hasContactedPlanningInspectorate) => {
	const enforcementDateUK = utcToZonedTime(parseISO(enforcementEffectiveDate), targetTimezone);

	const deadlineDate = hasContactedPlanningInspectorate
		? endOfDay(addDays(enforcementDateUK, 6))
		: endOfDay(subDays(enforcementDateUK, 1));

	return zonedTimeToUtc(deadlineDate, targetTimezone);
};

/**
 * @param {string} appealType
 * @param {string} enforcementEffectiveDate
 * @param {string} applicationDecisionDate
 * @param {boolean} hasContactedPlanningInspectorate
 * @returns {Date | { date: any; day: string; month: string; year: any; }} returns appeal deadline - note: should return Date as rawDate param set as true
 */
const getDeadlineV2 = (
	appealType,
	enforcementEffectiveDate = '',
	applicationDecisionDate = '',
	hasContactedPlanningInspectorate = false
) => {
	const deadline =
		appealType === CASE_TYPES.ENFORCEMENT.processCode ||
		appealType === CASE_TYPES.ENFORCEMENT_LISTED.processCode
			? enforcementNoticeDeadline(enforcementEffectiveDate, hasContactedPlanningInspectorate)
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
