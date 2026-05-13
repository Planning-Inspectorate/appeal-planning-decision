const { add, endOfDay, isValid: isDateValid, parseISO, addDays, subDays } = require('date-fns');
const { zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');
const { isUndefinedOrNull } = require('@pins/common/src/lib/is-not-undefined-or-null');

const { appeal } = require('../../config');
const isValid = require('../../validation/appeal/type/is-valid');
const isValidApplicationDecision = require('../../validation/appeal/application-decision/is-valid');
const { APPEAL_ID, APPLICATION_DECISION } = require('../../constants');
const BusinessRulesError = require('../../lib/business-rules-error');
const targetTimezone = 'Europe/London';

/**
 * @description Given an appeal's decision date, and an expiry period, determine the appeal's
 * deadline date.
 * @param {Object} params
 * @param {string|null} params.appealType - business-rules: APPEAL_ID
 * @param {Date|null} [params.decisionDate]
 * @param {string|null} [params.applicationDecision] - business-rules: APPLICATION_DECISION
 * @param {boolean|null} [params.isListedBuilding]
 * @param {string|null} [params.enforcementEffectiveDate]
 * @param {boolean|null} [params.hasContactedPlanningInspectorate]
 * @returns {Date|null}
 *
 * @throws {BusinessRulesError}
 */
module.exports = ({
	decisionDate,
	appealType,
	applicationDecision,
	isListedBuilding = null,
	enforcementEffectiveDate = null,
	hasContactedPlanningInspectorate = null
}) => {
	if (isUndefinedOrNull(appealType)) {
		return null;
	}

	if (appealType === APPEAL_ID.LAWFUL_DEVELOPMENT_CERTIFICATE && !isListedBuilding) {
		return null;
	}

	if (
		appealType === APPEAL_ID.ENFORCEMENT_NOTICE ||
		appealType === APPEAL_ID.ENFORCEMENT_LISTED_BUILDING
	) {
		return enforcementNoticeDeadline(enforcementEffectiveDate, hasContactedPlanningInspectorate);
	}

	if (isUndefinedOrNull(decisionDate)) {
		return null;
	}

	if (typeof decisionDate === 'string') {
		decisionDate = parseISO(decisionDate);
	}

	const decision = isUndefinedOrNull(applicationDecision)
		? APPLICATION_DECISION.REFUSED
		: applicationDecision;

	if (!isValidApplicationDecision(decision)) {
		throw new BusinessRulesError(`${decision} must be a valid application decision`);
	}

	if (!isDateValid(decisionDate)) {
		throw new BusinessRulesError('The given date must be a valid Date instance');
	}

	if (!isValid(appealType)) {
		throw new BusinessRulesError(`${appealType} is not a valid appeal type`);
	}

	const duration =
		appeal.type[appealType].appealDue[decision] === undefined
			? appeal.type[appealType].appealDue.duration
			: appeal.type[appealType].appealDue[decision].duration;
	const time =
		appeal.type[appealType].appealDue[decision] === undefined
			? appeal.type[appealType].appealDue.time
			: appeal.type[appealType].appealDue[decision].time;

	// given a utc datetime get the UK time
	const decisionDateUK = utcToZonedTime(decisionDate, targetTimezone);

	// run calculations
	const deadlineDate = endOfDay(
		add(decisionDateUK, {
			[duration]: time
		})
	);

	// return the equivalent utc datetime
	return zonedTimeToUtc(deadlineDate, targetTimezone);
};

/**
 * @param {string|Date|null} [enforcementEffectiveDate]
 * @param {boolean|null} [hasContactedPlanningInspectorate]
 * @returns {Date|null} returns appeal deadline
 */
const enforcementNoticeDeadline = (enforcementEffectiveDate, hasContactedPlanningInspectorate) => {
	if (isUndefinedOrNull(enforcementEffectiveDate)) {
		return null;
	}

	if (typeof enforcementEffectiveDate === 'string') {
		enforcementEffectiveDate = parseISO(enforcementEffectiveDate);
	}

	const enforcementDateUK = utcToZonedTime(enforcementEffectiveDate, targetTimezone);

	const deadlineDate = hasContactedPlanningInspectorate
		? endOfDay(addDays(enforcementDateUK, 6))
		: endOfDay(subDays(enforcementDateUK, 1));

	return zonedTimeToUtc(deadlineDate, targetTimezone);
};
