/**
 * @param {any} input
 * @returns {boolean}
 */
exports.isNotUndefinedOrNull = (input) => {
	return !exports.isUndefinedOrNull(input);
};

/**
 * @param {any} input
 * @returns {boolean}
 */
exports.isUndefinedOrNull = (input) => {
	return input === undefined || input === null;
};
