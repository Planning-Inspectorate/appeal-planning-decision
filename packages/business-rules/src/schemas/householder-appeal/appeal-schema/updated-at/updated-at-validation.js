const dateValidation = require('../../generic-validators/date-validation');

const updatedAtValidation = () => {
	return dateValidation(true);
};

module.exports = updatedAtValidation;
