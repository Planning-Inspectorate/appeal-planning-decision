const findTargetValueInJSON = (obj, target, ignoreKey) => {
	if (target in obj) {
		return obj[target];
	}

	for (const [key, value] of Object.entries(obj)) {
		if (key !== ignoreKey && typeof value === 'object' && value) {
			const result = findTargetValueInJSON(value, target, ignoreKey);
			if (result !== undefined) {
				return result;
			}
		}
	}

	return undefined;
};

module.exports = {
	findTargetValueInJSON
};
