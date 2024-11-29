const {
	APPEAL_USER_ROLES,
	EVENT_TYPES,
	EVENT_SUB_TYPES,
	LPA_USER_ROLE
} = require('@pins/common/src/constants');
const { format: formatDate } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
const targetTimezone = 'Europe/London';

/**
 * @typedef {import('@prisma/client').Event} PrismaEvent
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

			if (role === APPEAL_USER_ROLES.APPELLANT || role === LPA_USER_ROLE) {
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
 * @param {Array<PrismaEvent>} events
 * @param {string} role
 * @returns {Array<string|null>}
 */
const formatInquiries = (events, role) => {
	let inquiries = events.filter((item) => item.type === EVENT_TYPES.INQUIRY);
	return inquiries.map((inquiry) => {
		let formattedStartTime;
		let formattedStartDate;
		if (inquiry.startDate) {
			const ukStart = utcToZonedTime(inquiry.startDate, targetTimezone);
			formattedStartTime = formatDate(ukStart, 'h:mmaaa')?.replace(':00', '');
			formattedStartDate = formatDate(ukStart, 'd LLLL yyyy');
		}
		const address = [
			inquiry.addressLine1,
			inquiry.addressLine2,
			inquiry.addressTown,
			inquiry.addressCounty,
			inquiry.addressPostcode
		]
			.filter(Boolean)
			.join(', ');

		if (role === LPA_USER_ROLE) {
			return `The inquiry will start at ${formattedStartTime} on ${formattedStartDate}. You must attend the inquiry ${
				address ? `at ${address}` : '- address to be confirmed'
			}`;
		}
		return null;
	});
};

module.exports = { formatSiteVisits, formatInquiries };
