const { body } = require('express-validator');
const { isAfter } = require('date-fns');
const dateInputValidation = require('../custom/date-input');

const errorMessages = {
	missingAll: 'Enter the issue date on your enforcement notice',
	missingDayMonth: 'The issue date must include a day and month',
	missingDayYear: 'The issue date must include a day and year',
	missingDay: 'The issue date must include a day',
	missingMonthYear: 'The issue date must include a month and year',
	missingMonth: 'The issue date must include a month',
	missingYear: 'The issue date must include a year',
	invalidDate: 'The issue date must be a real date'
};

const rules = () => [
	...(dateInputValidation('enforcement-issue-date', 'enforcement issue date', errorMessages) || []),
	body('enforcement-issue-date').custom((value, { req }) => {
		const enteredDate = new Date(
			req.body['enforcement-issue-date-year'],
			parseInt(req.body['enforcement-issue-date-month'], 10) - 1,
			req.body['enforcement-issue-date-day']
		);

		if (isAfter(enteredDate, new Date())) {
			throw new Error('The issue date must be today or in the past');
		}

		return true;
	})
];

module.exports = {
	rules
};
