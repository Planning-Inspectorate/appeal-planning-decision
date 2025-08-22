/**
 * capitalizes the first letter of a string
 * @param {string} str
 * @returns {string}
 */
exports.capitalize = (str) => {
	if (typeof str !== 'string') return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * replaces new line chars with a <br>
 * @param {string} [value]
 * @returns {string}
 */
exports.nl2br = (value) => {
	if (!value) return '';

	return value.replace(/\r\n|\n/g, '<br>');
};
