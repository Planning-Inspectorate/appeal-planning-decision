const ApiError = require('../errors/apiError');
const logger = require('../lib/logger');
const { ResponsesRepository } = require('../repositories/responses-repository');
const responsesRepository = new ResponsesRepository();
const { HasQuestionnaireMapper } = require('../mappers/questionnaire-submission/has-mapper');
const questionnaireMapper = new HasQuestionnaireMapper();
const { broadcast } = require('../data-producers/lpa-response-producer');
const { blobMetaGetter } = require('./object-store');
const {
	initContainerClient,
	utils: { conjoinedPromises }
} = require('@pins/common');

const patchResponse = async (journeyId, referenceId, answers, lpaCode) => {
	if (!journeyId) {
		throw ApiError.noJourneyIdProvided();
	}

	if (!referenceId) {
		throw ApiError.noReferenceIdProvided();
	}

	try {
		return await responsesRepository.patchResponses(journeyId, referenceId, answers, lpaCode);
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

const submitResponse = async (questionnaireResponse) => {
	try {
		const uploadedFiles = Object.values(questionnaireResponse.answers).reduce((acc, answer) => {
			if (!answer.uploadedFiles) return acc;
			return acc.concat(answer.uploadedFiles);
		}, []);

		const uploadedFilesAndBlobMeta = await conjoinedPromises(
			uploadedFiles,
			blobMetaGetter(initContainerClient),
			(uploadedFile) => uploadedFile.location
		);

		const mappedData = questionnaireMapper.mapToPINSDataModel(
			questionnaireResponse,
			uploadedFilesAndBlobMeta
		);
		return await broadcast(mappedData);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitResponse();
	}
};

module.exports = { patchResponse, getResponse, submitResponse };
