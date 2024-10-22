const { parseISO, isValid } = require('date-fns');
const { format, utcToZonedTime } = require('date-fns-tz');
const logger = require('../lib/logger');

// default format (govuk)
const dateFilterDefaultFormat = 'd MMMM yyyy';
const targetTimeZone = 'Europe/London';

/**
 * CURRENTLY UNUSED
 * a uk time date filter for Nunjucks
 * usage: {{ date | govukDate(format string) }}
 * converts a date into UK local time and then renders into format provided or default govuk format
 * @param {String | Date} date
 * @param {String} dateFormat
 * @returns {String} formatted string if a valid date, otherwise an empty string
 */
const ukDateTimeFilter = function (date, dateFormat) {
	try {
		if (typeof date === 'string') {
			if (date.endsWith('Z')) {
				// Input date is in UTC
				date = parseISO(date);
			} else {
				// Input date is already zoned (e.g., '2023-07-27T12:34:56+01:00')
				date = new Date(date);
			}
		}

		const isValidDate = isValid(date);

		if (!isValidDate) {
			return '';
		}

		if (!dateFormat) {
			dateFormat = dateFilterDefaultFormat;
		}

		return format(utcToZonedTime(date, targetTimeZone), dateFormat);
	} catch (err) {
		logger.error(err);
	}

	return '';
};

module.exports = {
	ukDateTimeFilter
};
