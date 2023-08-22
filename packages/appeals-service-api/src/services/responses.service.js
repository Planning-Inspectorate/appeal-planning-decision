const ApiError = require('../errors/apiError');
const logger = require('../lib/logger');
const ResponsesRepository = require('../repositories/responses-repository');

const responsesRepository = new ResponsesRepository();

const patchResponse = async (formId, referenceId, answers) => {
	if (!formId) {
		throw ApiError.noFormIdProvided();
	}

	if (!referenceId) {
		throw ApiError.noReferenceIdProvided();
	}

	const uniqueId = `${formId}:${referenceId}`;

	try {
		return await responsesRepository.patchResponses(uniqueId, answers);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToUpdateResponse();
	}
};

module.exports = { patchResponse };
