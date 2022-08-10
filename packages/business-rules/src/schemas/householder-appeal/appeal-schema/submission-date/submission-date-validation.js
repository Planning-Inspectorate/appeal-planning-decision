const dateValidation = require('../../generic-validators/date-validation');

const submissionDateValidation = () => {
	return dateValidation();
};

module.exports = submissionDateValidation;
