const { EVENT_TYPES } = require('@pins/common/src/constants');
const { format: formatDate } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
const { APPEAL_EVENT_STATUS } = require('@planning-inspectorate/data-model');

/**
 * @typedef {import('appeals-service-api').Api.Event} Event
 */

/**
 * @param {Array<Event>} events
 * @param {string} caseStatus
 * @returns {Array<string>}
 */
exports.formatCommentHearingText = (events, caseStatus) => {
	const hearings = events.filter(
		(event) => event.type === EVENT_TYPES.HEARING && event.status !== APPEAL_EVENT_STATUS.WITHDRAWN
	);
	if (caseStatus === APPEAL_EVENT_STATUS.WITHDRAWN) {
		return [];
	}
	return hearings.length
		? hearings.map((hearing) => {
				const date = hearing.startDate;
				const formattedDate = formatDate(utcToZonedTime(date, 'Europe/London'), 'd LLLL yyyy');
				return `The hearing will start on ${formattedDate}.`;
			})
		: [];
};
