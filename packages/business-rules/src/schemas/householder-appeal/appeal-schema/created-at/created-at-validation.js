const dateValidation = require('../../generic-validators/date-validation');

const createdAtValidation = () => {
	return dateValidation(true);
};

module.exports = createdAtValidation;
