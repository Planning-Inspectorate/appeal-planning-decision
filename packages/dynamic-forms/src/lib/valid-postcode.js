const { fullPostcodeRegex } = require('./regex');

/**
 * @param {string} postcode
 * @param {string} errorMessage
 * @returns {string}
 */
const validatePostcode = (postcode, errorMessage = 'Enter a full UK postcode') => {
	const result = fullPostcodeRegex.exec(postcode);
	if (!result) {
		throw new Error(errorMessage);
	}
	return postcode;
};

module.exports = validatePostcode;
