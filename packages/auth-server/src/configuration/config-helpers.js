/**
 * @param {*} value
 * @param {number} fallback
 * @returns {number}
 */
export const numberWithDefault = (value, fallback) => {
	const num = parseInt(value);
	if (isNaN(num)) {
		return fallback;
	}
	return num;
};

/**
 * @template T
 * @param {string} key - env var name
 * @param {string} [typeCheck] - if provided will check each item in the array matches this type with a typeof check
 * @returns {Array<T>}
 */
export const getJsonArray = (key, typeCheck) => {
	let result;

	const value = process.env[key];

	if (!value) {
		throw new Error(`${key} is required`);
	}

	result = JSON.parse(value);

	if (!Array.isArray(result)) {
		throw new Error(`${key} must be a json array`);
	}

	if (typeCheck) {
		result.forEach((x) => {
			if (typeof x !== typeCheck) {
				throw new Error(`${key} must be an array of ${typeCheck}`);
			}
		});
	}

	return result;
};
