const {
	APPEAL_USER_ROLES,
	EVENT_TYPES,
	EVENT_SUB_TYPES,
	LPA_USER_ROLE
} = require('@pins/common/src/constants');
const { format: formatDate } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
const { formatEventAddress } = require('../lib/format-address');
const targetTimezone = 'Europe/London';

/**
 * @typedef {import('appeals-service-api').Api.Event} Event
 */

/**
 * @param {Array<Event>} events
 * @param {string} role
 * @returns {Array<string|null>}
 */
const formatSiteVisits = (events, role) => {
	let siteVisits = events.filter((item) => item.type === EVENT_TYPES.SITE_VISIT);

	return siteVisits
		.map((siteVisit) => {
			const { formattedTime: formattedStartTime, formattedDate: formattedStartDate } =
				getFormattedTimeAndDate(siteVisit.startDate);
			const { formattedTime: formattedEndTime, formattedDate: formattedEndDate } =
				getFormattedTimeAndDate(siteVisit.endDate);

			if (
				role === APPEAL_USER_ROLES.APPELLANT ||
				role === APPEAL_USER_ROLES.AGENT ||
				role === LPA_USER_ROLE
			) {
				switch (siteVisit.subtype) {
					case EVENT_SUB_TYPES.ACCESS: {
						const when =
							formattedStartDate === formattedEndDate
								? `between ${formattedStartTime} and ${formattedEndTime} on ${formattedStartDate}`
								: `between ${formattedStartTime} on ${formattedStartDate} and ${formattedEndTime} on ${formattedEndDate}`;
						return `Our inspector will visit the site ${when}. Someone must be at the site to give our inspector access.`;
					}
					case EVENT_SUB_TYPES.ACCOMPANIED: {
						return `Our inspector will visit the site at ${formattedStartTime} on ${formattedStartDate}. You and the other main party must attend the site visit.`;
					}
					case EVENT_SUB_TYPES.UNACCOMPANIED: {
						return 'Our inspector will visit the site. You do not need to attend.';
					}
					default: {
						return null;
					}
				}
			}

			return null;
		})
		.filter(Boolean);
};

/**
 * @param {Array<Event>} events
 * @param {string} role
 * @returns {Array<string|undefined>}
 */
const formatInquiries = (events, role) => {
	let inquiries = events.filter((item) => item.type === EVENT_TYPES.INQUIRY);
	return inquiries
		.map((inquiry) => {
			const { formattedTime: formattedStartTime, formattedDate: formattedStartDate } =
				getFormattedTimeAndDate(inquiry.startDate);
			const address = formatEventAddress(inquiry);

			if (
				role === LPA_USER_ROLE ||
				role === APPEAL_USER_ROLES.APPELLANT ||
				role === APPEAL_USER_ROLES.AGENT ||
				role === APPEAL_USER_ROLES.RULE_6_PARTY
			) {
				return `The inquiry will start at ${formattedStartTime} on ${formattedStartDate}. You must attend the inquiry ${
					address ? `at ${address}.` : '- address to be confirmed.'
				}`;
			}
			return;
		})
		.filter(Boolean);
};

/**
 * @typedef {Object} formattedTimeAndDate
 * @property {string} formattedTime
 * @property {string} formattedDate
 */

/**
 * @param {string} date
 * @returns {formattedTimeAndDate}
 */
function getFormattedTimeAndDate(date) {
	const ukDate = utcToZonedTime(date, targetTimezone);
	return {
		formattedTime: formatDate(ukDate, 'h:mmaaa')?.replace(':00', ''),
		formattedDate: formatDate(ukDate, 'd LLLL yyyy')
	};
}

module.exports = { formatSiteVisits, formatInquiries };
