const { isBefore, endOfDay, sub } = require('date-fns');
const { utcToZonedTime, zonedTimeToUtc } = require('date-fns-tz');

const businessRules = require('../../../rules');
const isValid = require('../../generic/date/is-valid');
const targetTimezone = 'Europe/London';

/**
 * @description Given a starting point (givenDate), determine the deadline date, and whether
 * today (now) is within the decision date expiration period.
 *
 * @param {Date} givenDate
 * @param {string} appealType
 * @param {string} applicationDecision
 * @param {Date} now
 * @returns {boolean}
 */
module.exports = (givenDate, appealType, applicationDecision, now = new Date()) => {
	[givenDate, now].forEach(isValid);

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

	const deadlineDate = businessRules.appeal.deadlineDate(
		givenDate,
		appealType,
		applicationDecision
	);

	return isBefore(yesterdayUTC, deadlineDate);
};
