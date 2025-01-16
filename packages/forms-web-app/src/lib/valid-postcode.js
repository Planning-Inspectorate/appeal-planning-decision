const { fullPostcodeRegex } = require('@pins/common/src/regex');

const validatePostcode = (postcode, errorMessage = 'Enter a full UK postcode') => {
	const result = fullPostcodeRegex.exec(postcode);
	if (!result) {
		throw new Error(errorMessage);
	}
	return postcode;
};

module.exports = validatePostcode;
