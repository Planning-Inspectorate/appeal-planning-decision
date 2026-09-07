module.exports = (dict, key) =>
	Object.keys(dict)
		.filter((k) => k !== key)
		.reduce((obj, k) => {
			obj[k] = dict[k];
			return obj;
		}, {});
