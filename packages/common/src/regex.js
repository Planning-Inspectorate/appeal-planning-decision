// https://github.com/ideal-postcodes/postcode MIT

/**
 * Tests for a valid postcode
 */
module.exports.fullPostcodeRegex =
	/([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;

/**
 * Tests for the outward code section of a postcode
 */
module.exports.partialPostcodeRegex = /^[a-z]{1,2}\d[a-z\d]?$/i;
