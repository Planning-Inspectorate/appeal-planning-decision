// https://github.com/ideal-postcodes/postcode MIT

/**
 * Tests for a valid postcode
 */
module.exports.fullPostcodeRegex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i;

/**
 * Tests for the outward code section of a postcode
 */
module.exports.partialPostcodeRegex = /^[a-z]{1,2}\d[a-z\d]?$/i;
