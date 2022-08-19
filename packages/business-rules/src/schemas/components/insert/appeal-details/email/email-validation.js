const emailStringValidation = require('../../../string-validators/string-email-validation');

const emailValidation = () => {
	return emailStringValidation();
};

module.exports = emailValidation;
