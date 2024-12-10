const { EVENT_TYPES } = require('@pins/common/src/constants');
const { format: formatDate } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');

/**
 * @typedef {import('appeals-service-api').Api.Event} Event
 */

/**
 * @param {Array<Event>} events
 * @returns {Array<string>}
 */
exports.formatCommentHearingText = (events) => {
	const hearings = events.filter((event) => event.type === EVENT_TYPES.HEARING);
	return hearings.length
		? hearings.map((hearing) => {
				const date = hearing.startDate;
				const formattedDate = formatDate(utcToZonedTime(date, 'Europe/London'), 'd LLLL yyyy');
				return `The hearing will start on ${formattedDate}.`;
		  })
		: [];
};
