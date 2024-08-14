const ApiError = require('../../../errors/apiError');

const { ListedBuildingRepository } = require('./repo');

const repo = new ListedBuildingRepository();

/**
 * @param {string} reference
 * @returns {Promise<import('./repo').ListedBuilding>}
 */
exports.get = async (reference) => {
	const listedBuilding = await repo.get(reference);

	if (!listedBuilding) {
		throw ApiError.listedBuildingNotFound(reference);
	}

	return listedBuilding;
};

/**
 * @param {Array<import('./repo').ListedBuildingCreateInput>} listedBuildings
 * @returns {Promise<import('./repo').ListedBuildingUpsertManyResponse>}
 */
exports.put = async (listedBuildings) => {
	if (!listedBuildings) {
		throw ApiError.badRequest();
	}

	return await repo.upsertMany(listedBuildings);
};
