/**
 * @param {string} typeOfSearch
 */
exports.formatLink = (typeOfSearch) => {
	if (typeOfSearch === 'postcode') {
		return 'enter-postcode';
	} else {
		return 'enter-appeal-reference';
	}
};

/**
 * @param {string} typeOfSearch
 * @returns {string}
 */
exports.formatTitlePrefix = (typeOfSearch) => {
	if (typeOfSearch === 'postcode') {
		return 'Appeals at ';
	} else {
		return 'Appeal ';
	}
};

/**
 * @param {string} typeOfSearch
 * @returns {string}
 */
exports.formatParagraphWording = (typeOfSearch) => {
	if (typeOfSearch === 'postcode') {
		return 'We could not find any appeals at ';
	} else {
		return 'We could not find an appeal for ';
	}
};
