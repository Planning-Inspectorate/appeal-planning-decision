const { isBefore, endOfDay, sub } = require('date-fns');
const { utcToZonedTime, zonedTimeToUtc } = require('date-fns-tz');

const businessRules = require('../../../rules');
const isValid = require('../../generic/date/is-valid');
const targetTimezone = 'Europe/London';

/**
 * @description Given a starting point (givenDate), determine the deadline date, and whether
 * today (now) is within the deadline period.
 *
 * @param {Object} params
 * @param {string|null} params.appealType
 * @param {Date|null} [params.givenDate]
 * @param {string|null} [params.applicationDecision]
 * @param {string} [params.applicationMadeUnderActSection]
 * @param {boolean} [params.isListedBuilding]
 * @param {string|null} [params.enforcementEffectiveDate]
 * @param {boolean|null} [params.hasContactedPlanningInspectorate]
 * @param {Date} [params.now]
 * @returns {boolean}
 */
module.exports = ({
	givenDate,
	appealType,
	applicationDecision,
	isListedBuilding = undefined,
	enforcementEffectiveDate = undefined,
	hasContactedPlanningInspectorate = undefined,
	now = new Date()
}) => {
	isValid(now);

	const deadlineDate = businessRules.appeal.deadlineDate({
		appealType,
		decisionDate: givenDate,
		applicationDecision,
		isListedBuilding,
		enforcementEffectiveDate,
		hasContactedPlanningInspectorate
	});

	// no deadline
	if (deadlineDate === null) {
		return true;
	}

	// given a utc datetime get the UK time
	const nowUK = utcToZonedTime(now, targetTimezone);

	// run calculations
	const yesterdayUK = endOfDay(
		sub(nowUK, {
			days: 1
		})
	);

	// return the equivalent utc datetime
	const yesterdayUTC = zonedTimeToUtc(yesterdayUK, targetTimezone);

	return isBefore(yesterdayUTC, deadlineDate);
};
