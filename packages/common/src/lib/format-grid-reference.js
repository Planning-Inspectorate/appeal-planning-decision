/**
 * @param {string} eastings
 * @param {string } northings
 * @returns {string}
 */
const formatGridReference = (eastings, northings) => {
	if (!eastings && !northings) return '';
	return `Eastings: ${eastings}\nNorthings: ${northings}`;
};

module.exports = { formatGridReference };
