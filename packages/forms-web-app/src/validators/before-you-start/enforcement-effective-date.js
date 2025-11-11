const dateInputValidation = require('../custom/date-input');

const errorMessages = {
	missingAll: 'Enter the effective date on your enforcement notice',
	missingDayMonth: 'The effective date must include a day and month',
	missingDayYear: 'The effective date must include a day and year',
	missingDay: 'The effective date must include a day',
	missingMonthYear: 'The effective date must include a month and year',
	missingMonth: 'The effective date must include a month',
	missingYear: 'The effective date must include a year',
	invalidDate: 'The effective date must be a real date'
};

const rules = () => [
	...(dateInputValidation(
		'enforcement-effective-date',
		'enforcement effective date',
		errorMessages
	) || [])
];

module.exports = {
	rules
};
