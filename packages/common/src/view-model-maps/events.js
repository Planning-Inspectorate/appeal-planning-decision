const { APPEAL_USER_ROLES, EVENT_TYPES, EVENT_SUB_TYPES } = require('@pins/common/src/constants');
const { format: formatDate } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
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
			const ukStart = utcToZonedTime(siteVisit.startDate, targetTimezone);
			const ukEnd = utcToZonedTime(siteVisit.endDate, targetTimezone);
			const formattedStartTime = formatDate(ukStart, 'h:mmaaa')?.replace(':00', '');
			const formattedStartDate = formatDate(ukStart, 'd LLLL yyyy');
			const formattedEndTime = formatDate(ukEnd, 'h:mmaaa')?.replace(':00', '');
			const formattedEndDate = formatDate(ukEnd, 'd LLLL yyyy');

			if (role === APPEAL_USER_ROLES.APPELLANT) {
				switch (siteVisit.subtype) {
					case EVENT_SUB_TYPES.ACCESS: {
						const when =
							formattedStartDate === formattedEndDate
								? `between ${formattedStartTime} and ${formattedEndTime} on ${formattedStartDate}`
								: `between ${formattedStartTime} on ${formattedStartDate} and ${formattedEndTime} on ${formattedEndDate}`;
						return `Our inspector will visit the site ${when}. Someone must be at the site to give our inspector access.`;
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

module.exports = { formatSiteVisits };