/**
 * @param {string} text
 * @returns {string}
 */
function removeDashesAndCapitaliseString(text) {
	const words = text.match(/[a-zA-Z][^\-+\s_]*[a-zA-Z]/g);
	if (!words) return '';
	const string = words
		.map((word) => {
			return word[0] + word.substring(1);
		})
		.join(' ');

	return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = { removeDashesAndCapitaliseString };
