const ListedBuildingRepository = require('../repositories/listed-building-repository');
const ApiError = require('../errors/apiError');
const Joi = require('joi');

const listedBuildingSchema = Joi.object({
	reference: Joi.string().required(),
	name: Joi.string().required(),
	listedBuildingGrade: Joi.string().required()
}).unknown(true);

const listedBuildingRepository = new ListedBuildingRepository();

const findListedBuilding = async (reference) => {
	const listedBuilding = await listedBuildingRepository.getListedBuilding(reference);

	if (!listedBuilding) {
		throw ApiError.listedBuildingNotFound(reference);
	}

	return listedBuilding;
};

const updateListedBuildings = async (listedBuildings) => {
	if (!listedBuildings) {
		throw ApiError.badRequest();
	}

	for (const listedbuilding of listedBuildings) {
		const validationResult = listedBuildingSchema.validate(listedbuilding);
		if (validationResult.error) {
			throw ApiError.badRequest();
		}
	}

	await listedBuildingRepository.updateListedBuildings(listedBuildings);
};

module.exports = {
	findListedBuilding,
	updateListedBuildings
};
