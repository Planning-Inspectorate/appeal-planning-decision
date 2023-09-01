const ApiError = require('../errors/apiError');
const logger = require('../lib/logger');
const { ResponsesRepository } = require('../repositories/responses-repository');

const responsesRepository = new ResponsesRepository();

const patchResponse = async (journeyId, referenceId, answers) => {
	if (!journeyId) {
		throw ApiError.noJourneyIdProvided();
	}

	if (!referenceId) {
		throw ApiError.noReferenceIdProvided();
	}

	try {
		return await responsesRepository.patchResponses(journeyId, referenceId, answers);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToUpdateResponse();
	}
};

const getResponse = async (journeyId, referenceId, projection) => {
	if (!journeyId) {
		throw ApiError.noJourneyIdProvided();
	}

	if (!referenceId) {
		throw ApiError.noReferenceIdProvided();
	}

	const uniqueId = `${journeyId}:${referenceId}`;

	try {
		return await responsesRepository.getResponses(uniqueId, projection);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToGetResponse();
	}
};

module.exports = { patchResponse, getResponse };
