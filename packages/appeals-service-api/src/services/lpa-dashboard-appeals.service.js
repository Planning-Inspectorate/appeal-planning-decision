const logger = require('../lib/logger');
const mongodb = require('../db/db');
const ApiError = require('../errors/apiError');

const getAppeals = async (lpaCode) => {
	let result;

	const appealsProjection = {
		projection: {
			caseReference: 1,
			LPAApplicationReference: 1,
			questionnaireDueDate: 1
		}
	};

	if (!lpaCode) {
		throw ApiError.noLpaCodeProvided();
	}

	try {
		//todo: add required 'status' field to .find (aapd-74)
		const cursor = await mongodb
			.get()
			.collection('appealsCaseData')
			.find({ LPACode: lpaCode }, appealsProjection);
		result = await cursor.toArray();
	} catch (err) {
		logger.error(err);
		throw ApiError.appealsCaseDataNotFound();
	}

	//todo: sort results by shortest (nearest?) deadline (aapd-43)
	return result;
};

module.exports = {
	getAppeals
};
