const logger = require('../lib/logger');
const { patchResponse, getResponse } = require('../services/responses.service');
const ApiError = require('../errors/apiError');
const BackOfficeV2Service = require('../services/back-office-v2');

const backOfficeV2Service = new BackOfficeV2Service();

const patchResponseByReferenceId = async (req, res) => {
	let statusCode = 200;
	let body = {};
	try {
		body = await patchResponse(
			req.params.journeyId,
			req.params.referenceId,
			req.body.answers,
			req.params.lpaCode
		);
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}
		logger.error(`Failed to patch response: ${error.code} // ${error.message.errors}`);
		statusCode = error.code;
		body = error.message.errors;
	}
	return res.status(statusCode).send(body);
};

const getResponseByReferenceId = async (req, res) => {
	let statusCode = 200;
	let body = {};
	try {
		body = await getResponse(req.params.journeyId, req.params.referenceId, req.params?.projection);
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}
		logger.error(`Failed to get response: ${error.code} // ${error.message.errors}`);
		statusCode = error.code;
		body = error.message.errors;
	}

	return res.status(statusCode).send(body);
};

const submitQuestionnaireResponse = async (req, res) => {
	let statusCode = 200;
	let body;
	let questionnaireResponse = {};
	try {
		questionnaireResponse = await getResponse(req.params.journeyId, req.params.referenceId);
		body = await backOfficeV2Service.submitQuestionnaire(questionnaireResponse);
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}
		statusCode = error.code;
		body = error.message.errors;
	}
	return res.status(statusCode).send(body);
};

module.exports = {
	patchResponseByReferenceId,
	getResponseByReferenceId,
	submitQuestionnaireResponse
};
