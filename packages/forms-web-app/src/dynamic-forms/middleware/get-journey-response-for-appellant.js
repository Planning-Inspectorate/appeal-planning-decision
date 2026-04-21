const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { JourneyResponse } = require('@pins/dynamic-forms/src/journey-response');
const { JOURNEY_TYPES, JOURNEY_TYPE } = require('@pins/common/src/dynamic-forms/journey-types');
const logger = require('#lib/logger');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const { ApiClientError } = require('@pins/common/src/client/api-client-error.js');
const { isFeatureActive } = require('../../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const { isExpeditedPart1Eligible } = require('../../lib/is-expedited-part1-eligible');

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
	let appealType = Object.values(JOURNEY_TYPES).find(
		(x) => x.type === JOURNEY_TYPE.appealForm && x.caseType === submission.appealTypeCode
	)?.id;

	if (typeof appealType === 'undefined') {
		throw new Error('appealType is undefined');
	}

	const convertedResponse = mapDBResponseToJourneyResponseFormat(submission);
	const expeditedAppealsEnabled = await isExpeditedAppealsFlagEnabled(submission.LPACode);

	if (
		appealType === JOURNEY_TYPES.S78_APPEAL_FORM.id &&
		expeditedAppealsEnabled &&
		isExpeditedPart1Eligible({
			typeOfPlanningApplication: convertedResponse?.typeOfPlanningApplication,
			applicationDate: convertedResponse?.onApplicationDate,
			eligibility: {
				applicationDecision: convertedResponse?.applicationDecision
			}
		})
	) {
		appealType = JOURNEY_TYPES.S78_PART_1_APPEAL_FORM.id;
	}

	const journeyResponse = new JourneyResponse(
		appealType,
		submissionId,
		convertedResponse,
		submission.LPACode
	);
	journeyResponse.expeditedAppealsEnabled = expeditedAppealsEnabled;

	response.locals.journeyResponse = journeyResponse;

	return next();
};

/**
 * @param {'HAS' | 'S78' | 'S20' | 'ADVERTS' | 'CAS_ADVERTS' | 'CAS_PLANNING' | 'ENFORCEMENT' | 'ENFORCEMENT_LISTED' | undefined } appealTypeCode
 * @param { string | undefined } LPACode
 * @returns {Promise<boolean>}
 */
const appealTypeFlagActive = async (appealTypeCode, LPACode) => {
	switch (appealTypeCode) {
		case CASE_TYPES.HAS.processCode:
			return true;
		case CASE_TYPES.S78.processCode:
			return true;
		case CASE_TYPES.S20.processCode:
			return true;
		case CASE_TYPES.ADVERTS.processCode:
			return true;
		case CASE_TYPES.CAS_ADVERTS.processCode:
			return true;
		case CASE_TYPES.CAS_PLANNING.processCode:
			return true;
		case CASE_TYPES.ENFORCEMENT.processCode:
			return await isFeatureActive(FLAG.ENFORCEMENT_APPEAL_FORM_V2, LPACode);
		case CASE_TYPES.ENFORCEMENT_LISTED.processCode:
			return await isFeatureActive(FLAG.ENFORCEMENT_LISTED_APPEAL_FORM_V2, LPACode);
		case CASE_TYPES.LDC.processCode:
			return await isFeatureActive(FLAG.LDC_APPEAL_FORM_V2, LPACode);
		default:
			return false;
	}
};

/**
 * @param { string | undefined } LPACode
 * @returns {Promise<boolean>}
 */
const isExpeditedAppealsFlagEnabled = async (LPACode) => {
	return await isFeatureActive(FLAG.EXPEDITED_APPEALS_FO_V2, LPACode);
};
