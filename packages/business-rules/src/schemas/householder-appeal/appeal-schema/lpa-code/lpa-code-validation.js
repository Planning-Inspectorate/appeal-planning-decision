const stringMaxCharsValidation = require('../../../components/string-validators/string-max-chars-validation');

const lpaCodeValidation = (valAction) => {
	return stringMaxCharsValidation(20);
};

module.exports = lpaCodeValidation;
