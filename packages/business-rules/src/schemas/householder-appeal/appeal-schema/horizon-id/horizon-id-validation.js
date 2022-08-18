const stringMaxCharsValidation = require('../../../components/string-validators/string-max-chars-validation');

const horizonIdValidation = () => {
	return stringMaxCharsValidation(20);
};

module.exports = horizonIdValidation;
