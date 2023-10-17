const logger = require('../lib/logger');
const { patchResponse, getResponse, submitResponse } = require('../services/responses.service');
const ApiError = require('../errors/apiError');

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
	let body = {};
	let questionnaireResponse = {};
	try {
		questionnaireResponse = await getResponse(req.params.journeyId, req.params.referenceId);
		body = await submitResponse(questionnaireResponse);
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
