/**
 * returns postcode string in upper case with whitespace removed
 *
 * @param {string} unsanitizedPostcode
 * @returns {string}
 */
module.exports = (unsanitizedPostcode) => {
	return unsanitizedPostcode.replace(' ', '').toUpperCase();
};
