const { formatInTimeZone } = require('date-fns-tz');
const { isValid } = require('date-fns');

const ukTimeZone = 'Europe/London';

/**
 * Display the date in Europe/London
 * @param {Date|string} [date]
 * @param {Object} [options]
 * @param {string} [options.format] date formatting string
 * @returns {string} formatted date string or empty string if invalid value passed in
 */
const formatDateForDisplay = (date, { format = 'd MMM yyyy' } = { format: 'd MMM yyyy' }) => {
	if (!date || !isValid(new Date(date))) return '';

	return formatInTimeZone(date, ukTimeZone, format);
};

module.exports = {
	formatDateForDisplay
};
