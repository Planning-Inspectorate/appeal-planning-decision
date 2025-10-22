/**
 * returns postcode string in upper case with whitespace removed
 *
 * @param {string|null|undefined} unsanitizedPostcode
 * @returns {string|null}
 */
module.exports = (unsanitizedPostcode) => {
	if (!unsanitizedPostcode) return null;
	return unsanitizedPostcode.replace(' ', '').toUpperCase();
};
