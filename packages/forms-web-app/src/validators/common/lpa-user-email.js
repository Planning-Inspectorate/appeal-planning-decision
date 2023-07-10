const { body } = require('express-validator');

const ruleYourEmail = () =>
	body('add-user').notEmpty().withMessage('Enter an email address in the correct format');

const rules = () => {
	return [ruleYourEmail()];
};

module.exports = {
	rules
};
