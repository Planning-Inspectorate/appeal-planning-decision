const stringMaxCharsValidation = require('../../string-validators/string-max-chars-validation');

stringMaxCharsValidation;

const lpaCodeValidation = () => {
	return stringMaxCharsValidation(20);
};

module.exports = lpaCodeValidation;
