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

const mapQuestionnaireDataForBackOffice = async (questionnaireResponse) => {
	const uploadedFiles = Object.values(questionnaireResponse.answers).reduce((acc, answer) => {
		if (!answer.uploadedFiles) return acc;
		return acc.concat(answer.uploadedFiles);
	}, []);

	const uploadedFilesAndBlobMeta = await conjoinedPromises(
		uploadedFiles,
		blobMetaGetter(initContainerClient),
		(uploadedFile) => uploadedFile.location
	);

	return questionnaireMapper.mapToPINSDataModel(questionnaireResponse, uploadedFilesAndBlobMeta);
};

const submitResponseFactory = (mapper, callback) => async (questionnaireResponse) => {
	try {
		return await callback(await mapper(questionnaireResponse));
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitResponse();
	}
};

const submitResponse = submitResponseFactory(mapQuestionnaireDataForBackOffice, broadcast);

module.exports = {
	getResponse,
	mapQuestionnaireDataForBackOffice,
	patchResponse,
	submitResponse,
	submitResponseFactory
};
