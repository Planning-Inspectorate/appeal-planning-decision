const findTargetValueInJSON = (obj, target) => {
	if (target in obj) {
		return obj[target];
	}

	for (const value of Object.values(obj)) {
		if (typeof value === 'object' && value) {
			const result = findTargetValueInJSON(value, target);
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
