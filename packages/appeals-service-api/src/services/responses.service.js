const ApiError = require('../errors/apiError');
const logger = require('../lib/logger');
const { ResponsesRepository } = require('../repositories/responses-repository');
const responsesRepository = new ResponsesRepository();
const { HasQuestionnaireMapper } = require('../mappers/questionnaire-submission/has-mapper');
const questionnaireMapper = new HasQuestionnaireMapper();
const { broadcast } = require('../data-producers/lpa-response-producer');
const { initContainerClient, getBlobMeta } = require('./object-store');

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

const getBlobLocations = (questionnaireResponse) => {
	Object.values(questionnaireResponse.answers ?? {}).reduce((acc, cur) => {
		if (!cur?.uploadedFiles) return acc;
		return [...acc, ...cur.uploadedFiles.map(({ location }) => location)];
	}, []);
};

const submitResponse = async (questionnaireResponse) => {
	try {
		const blobLocations = getBlobLocations(questionnaireResponse);
		const blobMeta = await Promise.all(blobLocations.map(getBlobMeta(initContainerClient)));
		console.log('🚀 ~ file: responses.service.js:59 ~ submitResponse ~ blobMeta:', blobMeta);
		const mappedData = questionnaireMapper.mapToPINSDataModel(questionnaireResponse);
		return await broadcast(mappedData);
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitResponse();
	}
};

module.exports = { patchResponse, getResponse, submitResponse };
