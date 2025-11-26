const { body } = require('express-validator');
const { isLeapYear, startOfDay, isAfter } = require('date-fns');
const monthMap = require('../../lib/month-map.js');
const {
	dateInputsToDate
} = require('@pins/dynamic-forms/src/dynamic-components/utils/date-inputs-to-date.js');

const errorMessages = {
	missingAll: 'Enter the date you contacted the Planning Inspectorate',
	missingDayMonth: 'The date you contacted the Planning Inspectorate must include a day and month',
	missingDayYear: 'The date you contacted the Planning Inspectorate must include a day and year',
	missingDay: 'The date you contacted the Planning Inspectorate must include a day',
	missingMonthYear:
		'The date you contacted the Planning Inspectorate must include a month and year',
	missingMonth: 'The date you contacted the Planning Inspectorate must include a month',
	missingYear: 'The date you contacted the Planning Inspectorate must include a year',
	invalidDate: 'The date you contacted the Planning Inspectorate must be a real date',
	futureDate: 'The date you contacted the Planning Inspectorate must be today or in the past'
};

const rules = () => {
	const dayInput = 'contact-planning-inspectorate-date-day';
	const monthInput = 'contact-planning-inspectorate-date-month';
	const yearInput = 'contact-planning-inspectorate-date-year';

	return [
		body(dayInput)
			.trim()
			.notEmpty()
			.withMessage((_, { req }) => {
				if (!req.body[monthInput] && !req.body[yearInput]) {
					return errorMessages.missingAll;
				}

				if (!req.body[monthInput] && req.body[yearInput]) {
					return errorMessages.missingDayMonth;
				}

				if (req.body[monthInput] && !req.body[yearInput]) {
					return errorMessages.missingDayYear;
				}

				return errorMessages.missingDay;
			}),

		body(monthInput)
			.trim()
			.notEmpty()
			.withMessage((_, { req }) => {
				if (!req.body[yearInput]) {
					return errorMessages.missingMonthYear;
				}

				return errorMessages.missingMonth;
			}),

		body(yearInput).trim().notEmpty().withMessage(errorMessages.missingYear),

		body(dayInput)
			.trim()
			.isInt({ min: 1, max: 31 })
			.withMessage(errorMessages.invalidDate)
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
			.withMessage(errorMessages.invalidDate),

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
			.withMessage(errorMessages.invalidDate),

		body(yearInput).trim().isInt({ min: 1000, max: 9999 }).withMessage(errorMessages.invalidDate),

		body(dayInput)
			.trim()
			.custom((value, { req }) => {
				const inputDate = dateInputsToDate(value, req.body[monthInput], req.body[yearInput]);
				const today = startOfDay(new Date());

				if (isAfter(inputDate, today)) {
					return false;
				}

				return true;
			})
			.withMessage(errorMessages.futureDate)
	];
};

module.exports = {
	rules
};
