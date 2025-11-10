const { body } = require('express-validator');
const { isLeapYear } = require('date-fns');
const { capitalize } = require('../../lib/string-functions');
const monthMap = require('../../lib/month-map.js');

/**
 * Generic validator that validates date input as per https://design-system.service.gov.uk/components/date-input/
 *
 * @param inputRef - ID of input passed to date component
 * @param res - Label used by error messages so user understands data required (e.g Date of Birth)
 * @param customMessages - obj with custom error messages to display instead of defaults
 * @returns {Array}
 */

module.exports = (inputRef, inputLabel, customMessages = {}) => {
	const dayInput = `${inputRef}-day`;
	const monthInput = `${inputRef}-month`;
	const yearInput = `${inputRef}-year`;

	const defaultMessages = {
		missingAll: `Enter ${inputLabel}`,
		missingDayMonth: `${capitalize(inputLabel)} must include a day and month`,
		missingDayYear: `${capitalize(inputLabel)} must include a day and year`,
		missingDay: `${capitalize(inputLabel)} must include a day`,
		missingMonthYear: `${capitalize(inputLabel)} must include a month and year`,
		missingMonth: `${capitalize(inputLabel)} must include a month`,
		missingYear: `${capitalize(inputLabel)} must include a year`,
		invalidDate: `${capitalize(inputLabel)} must be a real date`
	};
	const messages = { ...defaultMessages, ...customMessages };

	return [
		body(dayInput)
			.trim()
			.notEmpty()
			.withMessage((_, { req }) => {
				if (!req.body[monthInput] && !req.body[yearInput]) {
					return messages.missingAll;
				}

				if (!req.body[monthInput] && req.body[yearInput]) {
					return messages.missingDayMonth;
				}

				if (req.body[monthInput] && !req.body[yearInput]) {
					return messages.missingDayYear;
				}

				return messages.missingDay;
			}),

		body(monthInput)
			.trim()
			.notEmpty()
			.withMessage((_, { req }) => {
				if (!req.body[yearInput]) {
					return messages.missingMonthYear;
				}

				return messages.missingMonth;
			}),

		body(yearInput).trim().notEmpty().withMessage(messages.missingYear),

		body(dayInput)
			.trim()
			.isInt({ min: 1, max: 31 })
			.withMessage(messages.invalidDate)
			.bail()
			.toInt()
			.custom((value, { req }) => {
				const monthNum = parseInt(req.body[monthInput], 10);
				if (value === 31 && monthNum && [4, 6, 9, 11].includes(monthNum)) return false;

				if (value > 28 && monthNum && monthNum === 2) {
					const yearNum = parseInt(req.body[yearInput], 10);
					return yearNum && isLeapYear(new Date(yearNum, 1, 1)) && value === 29;
				}

				return true;
			})
			.withMessage(messages.invalidDate),

		body(monthInput)
			.trim()
			.custom((value) => {
				if (!isNaN(value) && value >= 1 && value <= 12) {
					return true;
				}

				const monthNumber = monthMap[value.toLowerCase()];
				if (monthNumber) {
					if (!isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
						return true;
					}
				}

				return false;
			})
			.withMessage(messages.invalidDate),

		body(yearInput).trim().isInt({ min: 1000, max: 9999 }).withMessage(messages.invalidDate)
	];
};
