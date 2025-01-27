const { put, get } = require('./service');

/**
 * @type {import('express').RequestHandler}
 */
exports.put = async (req, res) => {
	const listedBuildings = req.body;

	let result = {};
	if (Array.isArray(listedBuildings)) {
		result = await put(listedBuildings);
	} else {
		result = await put([listedBuildings]);
	}

	res.status(200).json(result);
};

/**
 * @type {import('express').RequestHandler}
 */
exports.get = async (req, res) => {
	const listedBuildingRef = req.params.reference;
	const lb = await get(listedBuildingRef);
	res.status(200).json(lb);
};
