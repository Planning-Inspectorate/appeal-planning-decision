const stringMaxCharsValidation = require('../../string-validators/string-max-chars-validation');

stringMaxCharsValidation;
const horizonIdValidation = () => {
	return stringMaxCharsValidation(20);
};

module.exports = horizonIdValidation;
