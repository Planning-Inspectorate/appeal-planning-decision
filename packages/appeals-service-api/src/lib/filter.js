/**
 * type guard/filter for not-null
 *
 * @param {T|null} value
 * @returns {value is T}
 * @template T
 */
function filterNotNull(value) {
	return value !== null;
}

module.exports = {
	filterNotNull
};
