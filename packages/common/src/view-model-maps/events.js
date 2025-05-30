const { APPEAL_USER_ROLES, EVENT_TYPES, EVENT_SUB_TYPES, LPA_USER_ROLE } = require('../constants');
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
			if (
				role === APPEAL_USER_ROLES.APPELLANT ||
				role === APPEAL_USER_ROLES.AGENT ||
				role === LPA_USER_ROLE
			) {
				if (siteVisit.subtype === EVENT_SUB_TYPES.UNACCOMPANIED) {
					return 'Our inspector will visit the site. You do not need to attend.';
				}

				const formattedStart = getFormattedTimeAndDate(siteVisit.startDate);
				const formattedEnd = getFormattedTimeAndDate(siteVisit.endDate);

				if (!formattedStart) return null; // shouldn't happen, can't show an accompanied site visit without a date to be present for

				const startOnlyWhen = `at ${formattedStart.formattedTime} on ${formattedStart.formattedDate}`;

				switch (siteVisit.subtype) {
					case EVENT_SUB_TYPES.ACCESS: {
						let when = startOnlyWhen;
						if (formattedEnd) {
							when =
								formattedStart.formattedDate === formattedEnd.formattedDate
									? `between ${formattedStart.formattedTime} and ${formattedEnd.formattedTime} on ${formattedStart.formattedDate}`
									: `between ${formattedStart.formattedTime} on ${formattedStart.formattedDate} and ${formattedEnd.formattedTime} on ${formattedEnd.formattedDate}`;
						}

						return `Our inspector will visit the site ${when}. Someone must be at the site to give our inspector access.`;
					}
					case EVENT_SUB_TYPES.ACCOMPANIED: {
						return `Our inspector will visit the site ${startOnlyWhen}. You and the other main party must attend the site visit.`;
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
				if (address) {
					return {
						lineOne:
							`The inquiry will start at ${formattedStartTime} on ${formattedStartDate}. ` +
							`You must attend the inquiry at ${address}.`
					};
				} else {
					return {
						lineOne:
							`The inquiry will start at ${formattedStartTime} on ${formattedStartDate}. ` +
							`We will contact you when we confirm the venue address.`,
						lineTwo: 'You must attend the inquiry.'
					};
				}
			}
			return;
		})
		.filter(Boolean);
};

/**
 * @param {Array<Event>} events
 * @param {string} role
 * @returns {Array<string|undefined>}
 */
const formatHearings = (events, role) => {
	let hearings = events.filter((item) => item.type === EVENT_TYPES.HEARING);
	return hearings
		.map((hearing) => {
			const { formattedTime: formattedStartTime, formattedDate: formattedStartDate } =
				getFormattedTimeAndDate(hearing.startDate);
			const address = formatEventAddress(hearing);
			if (role === LPA_USER_ROLE) {
				if (address) {
					return {
						lineOne:
							`The hearing will start at ${formattedStartTime} on ${formattedStartDate}. ` +
							`You must attend the hearing at ${address}.`
					};
				} else {
					return {
						lineOne:
							`The hearing will start at ${formattedStartTime} on ${formattedStartDate}. ` +
							`We will contact you when we confirm the venue address.`,
						lineTwo: 'You must attend the hearing.'
					};
				}
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
 * @returns {formattedTimeAndDate|null}
 */
function getFormattedTimeAndDate(date) {
	if (!date) return null;

	const ukDate = utcToZonedTime(date, targetTimezone);
	return {
		formattedTime: formatDate(ukDate, 'h:mmaaa')?.replace(':00', ''),
		formattedDate: formatDate(ukDate, 'd LLLL yyyy')
	};
}

module.exports = { formatSiteVisits, formatInquiries, formatHearings };
