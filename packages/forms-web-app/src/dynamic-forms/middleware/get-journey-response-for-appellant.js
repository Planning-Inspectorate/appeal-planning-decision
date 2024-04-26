const { JourneyResponse } = require('../journey-response');
const { APPELLANT_JOURNEY_TYPES_FORMATTED } = require('../journey-factory');
const logger = require('#lib/logger');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const { ApiClientError } = require('@pins/common/src/client/api-client-error.js');
const { isFeatureActive } = require('../../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');

/**
 *
 * @param {unknown} submissionId
 * @returns {submissionId is string}
 */
const isValidSubmissionId = (submissionId) => !!submissionId && typeof submissionId === 'string';

/**
 * @type {import('express').Handler}
 */
module.exports = async (request, response, next) => {
	const { id: submissionId } = request.query;

	if (!isValidSubmissionId(submissionId)) {
		return response.status(404).render('error/not-found');
	}

	let submission;
	try {
		submission = await request.appealsApiClient.getAppellantSubmission(submissionId);
	} catch (error) {
		if (error instanceof ApiClientError && error.code === 404) {
			return response.status(404).render('error/not-found');
		}
		// @ts-ignore
		logger.error(error);
	}

	if (!submission || !(await isFeatureActive(FLAG.APPEAL_FORM_V2, submission.LPACode))) {
		return response.status(404).render('error/not-found');
	}

	const appealType = APPELLANT_JOURNEY_TYPES_FORMATTED[submission.appealTypeCode];

	if (typeof appealType === 'undefined') {
		throw new Error('appealType is undefined');
	}

	const convertedResponse = mapDBResponseToJourneyResponseFormat(submission);
	const journeyResponse = new JourneyResponse(
		appealType,
		submissionId,
		convertedResponse,
		submission.LPACode
	);

	response.locals.journeyResponse = journeyResponse;

	return next();
};
