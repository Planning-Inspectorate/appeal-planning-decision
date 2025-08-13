const { body } = require('express-validator');
const { isAfter } = require('date-fns');
const dateInputValidation = require('../../custom/date-input');

const rules = () => [
	...(dateInputValidation('decision-date-householder', 'the decision date') || []),
	body('decision-date-householder').custom((value, { req }) => {
		const enteredDate = new Date(
			req.body['decision-date-householder-year'],
			(parseInt(req.body['decision-date-householder-month'], 10) - 1).toString(),
			req.body['decision-date-householder-day']
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
