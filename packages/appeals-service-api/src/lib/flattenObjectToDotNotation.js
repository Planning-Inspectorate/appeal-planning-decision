const flattenObjectToDotNotation = (data, prefix = '') => {
	const result = {};

	Object.entries(data).forEach(([key, value]) => {
		if (typeof value === 'object' && !(value instanceof Date)) {
			Object.assign(result, flattenObjectToDotNotation(value, `${prefix}${key}.`));
		} else {
			result[`${prefix}${key}`] = value;
		}
	});

	return result;
};

module.exports = flattenObjectToDotNotation;
