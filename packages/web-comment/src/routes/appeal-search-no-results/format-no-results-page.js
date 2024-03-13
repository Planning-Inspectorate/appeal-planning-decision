/**
 * @param {string} searchQuery
 * @returns {string}
 */
exports.isPostcodeOrReferenceNumber = (searchQuery) => {
	const fullPostcodeRegex =
		/^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$/;

	const partialPostcodeRegex =
		/^((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))))$/;

	if (searchQuery.match(fullPostcodeRegex) || searchQuery.match(partialPostcodeRegex)) {
		return 'postcode';
	} else {
		return 'referenceNumber';
	}
};

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
