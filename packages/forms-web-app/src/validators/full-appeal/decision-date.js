const { body } = require('express-validator');
const { isAfter } = require('date-fns');
const dateInputValidation = require('../custom/date-input');

const rules = () => [
	...(dateInputValidation('decision-date', 'the decision date') || []),
	body('decision-date').custom((value, { req }) => {
		const enteredDate = new Date(
			req.body['decision-date-year'],
			parseInt(req.body['decision-date-month'], 10) - 1,
			req.body['decision-date-day']
		);

		if (isAfter(enteredDate, new Date())) {
			throw new Error('Decision date must be today or in the past');
		}

		return true;
	})
];

module.exports = {
	rules
};
