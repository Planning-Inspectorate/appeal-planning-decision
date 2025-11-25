const dateInputValidation = require('../custom/date-input');

const errorMessages = {
	missingAll: 'Enter the date you contacted the Planning Inspectorate',
	missingDayMonth: 'The date you contacted the Planning Inspectorate must include a day and month',
	missingDayYear: 'The date you contacted the Planning Inspectorate must include a day and year',
	missingDay: 'The date you contacted the Planning Inspectorate must include a day',
	missingMonthYear:
		'The date you contacted the Planning Inspectorate must include a month and year',
	missingMonth: 'The date you contacted the Planning Inspectorate must include a month',
	missingYear: 'The date you contacted the Planning Inspectorate must include a year',
	invalidDate: 'The date you contacted the Planning Inspectorate must be a real date'
};

const rules = () => [
	...(dateInputValidation(
		'contact-planning-inspectorate-date',
		'contact planning inspectorate date',
		errorMessages
	) || [])
];

module.exports = {
	rules
};
