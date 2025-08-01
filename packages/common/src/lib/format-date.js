const { formatInTimeZone, zonedTimeToUtc } = require('date-fns-tz');
const { isValid } = require('date-fns');

const ukTimeZone = 'Europe/London';

/**
 * Display the date in Europe/London
 * @param {Date|string} [date]
 * @param {Object} [options]
 * @param {string} [options.format] date formatting string, defaults to shortened month
 * @returns {string} formatted date string or empty string if invalid value passed in
 */
const formatDateForDisplay = (date, { format = 'd MMM yyyy' } = { format: 'd MMM yyyy' }) => {
	if (!date || !isValid(new Date(date))) return '';

	return formatInTimeZone(date, ukTimeZone, format);
};

/**
 * @typedef {Object} DateTimeParams
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {number} [hour]
 * @property {number} [minute]
 * @property {boolean} [convertToUTC]
 */

/**
 * Parse the date and time parameters provided by a user
 * @param {DateTimeParams} params
 * @returns {Date}
 */
const parseDateInput = ({ year, month, day, hour = 0, minute = 0 }) => {
	const dateStr = `${year}-${pad(month)}-${pad(day)}`;
	const timeStr = `${pad(hour)}:${pad(minute)}`;
	return zonedTimeToUtc(`${dateStr} ${timeStr}`, ukTimeZone);
};

/**
 * Pad a number with leading zeros
 *
 * @param {number} num
 * @params {number} [length]
 * @returns {string}
 */
const pad = (num, length = 2) => {
	return num.toString().padStart(length, '0');
};

module.exports = {
	formatDateForDisplay,
	parseDateInput
};
