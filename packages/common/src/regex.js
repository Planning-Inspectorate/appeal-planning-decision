// postcode regexes from ideal-postcodes package: MIT license https://github.com/ideal-postcodes/postcode/blob/master/LICENSE

/**
 * Tests for a valid postcode
 */
module.exports.fullPostcodeRegex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i;

/**
 * Tests for the outward code section of a postcode
 */
module.exports.partialPostcodeRegex = /^[a-z]{1,2}\d[a-z\d]?$/i;

/**
 * Copied from uuid package: MIT license https://github.com/uuidjs/uuid/blob/main/LICENSE.md
 * Tests for valid uuid
 */
module.exports.uuidRegex =
	/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
