const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { JourneyResponse } = require('../journey-response');
const { JOURNEY_TYPES, JOURNEY_TYPE } = require('@pins/common/src/dynamic-forms/journey-types');
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

	if (!submission || !(await appealTypeFlagActive(submission.appealTypeCode, submission.LPACode))) {
		return response.status(404).render('error/not-found');
	}

	// lookup type by submission type code
	const appealType = Object.values(JOURNEY_TYPES).find(
		(x) => x.type === JOURNEY_TYPE.appealForm && x.caseType === submission.appealTypeCode
	)?.id;

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

/**
 * @param {'HAS' | 'S78' | 'S20' | undefined } appealTypeCode
 * @param { string | undefined } LPACode
 * @returns {Promise<boolean>}
 */
const appealTypeFlagActive = async (appealTypeCode, LPACode) => {
	switch (appealTypeCode) {
		case CASE_TYPES.HAS.processCode:
			return await isFeatureActive(FLAG.HAS_APPEAL_FORM_V2, LPACode);
		case CASE_TYPES.S78.processCode:
			return await isFeatureActive(FLAG.S78_APPEAL_FORM_V2, LPACode);
		case CASE_TYPES.S20.processCode:
			return await isFeatureActive(FLAG.S20_APPEAL_FORM_V2, LPACode);
		case CASE_TYPES.ADVERTS.processCode:
			return await isFeatureActive(FLAG.ADVERTS_APPEAL_FORM_V2, LPACode);
		case CASE_TYPES.CAS_ADVERTS.processCode:
			return await isFeatureActive(FLAG.CAS_ADVERTS_APPEAL_FORM_V2, LPACode);
		case CASE_TYPES.CAS_PLANNING.processCode:
			return await isFeatureActive(FLAG.CAS_PLANNING_APPEAL_FORM_V2, LPACode);
		default:
			return false;
	}
};
