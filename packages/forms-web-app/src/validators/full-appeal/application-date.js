const { body } = require('express-validator');
const { isAfter } = require('date-fns');
const dateInputValidation = require('../custom/date-input');

const rules = () => [
	...(dateInputValidation('application-date', 'the application date') || []),
	body('application-date').custom((value, { req }) => {
		const enteredDate = new Date(
			req.body['application-date-year'],
			parseInt(req.body['application-date-month'], 10) - 1,
			req.body['application-date-day']
		);

		if (isAfter(enteredDate, new Date())) {
			throw new Error('The date you submitted your application must be today or in the past');
		}

		return true;
	})
];

module.exports = {
	rules
};
