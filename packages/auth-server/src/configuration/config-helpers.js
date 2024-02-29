/**
 * @param {*} value
 * @param {number} fallback
 * @returns {number}
 */
export function numberWithDefault(value, fallback) {
	const num = parseInt(value);
	if (isNaN(num)) {
		return fallback;
	}
	return num;
}
