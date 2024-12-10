/**
 * @typedef {import('appeals-service-api').Api.Event} Event
 */

const { EVENT_TYPES } = require('@pins/common/src/constants');
const { format: formatDate } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');

/**
 * @param {Array<Event>} events
 * @returns {Array<string>}
 */
exports.formatCommentInquiryText = (events) => {
	const inquiries = events.filter((event) => event.type === EVENT_TYPES.INQUIRY);
	return inquiries.length
		? inquiries.map((inquiry) => {
				const date = inquiry.startDate;
				const formattedDate = formatDate(utcToZonedTime(date, 'Europe/London'), 'd LLLL yyyy');
				return `The inquiry will start on ${formattedDate}.`;
		  })
		: [];
};
