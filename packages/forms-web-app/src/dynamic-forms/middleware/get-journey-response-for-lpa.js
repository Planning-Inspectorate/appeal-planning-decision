const { JourneyResponse } = require('@pins/dynamic-forms/src/journey-response');
const { JOURNEY_TYPES, JOURNEY_TYPE } = require('@pins/common/src/dynamic-forms/journey-types');
const logger = require('#lib/logger');
const { getUserFromSession } = require('../../services/user.service');
const { mapDBResponseToJourneyResponseFormat } = require('./utils');
const {
	isLPAQuestionnaireOpen
} = require('@pins/business-rules/src/rules/appeal-case/case-due-dates');
const { ApiClientError } = require('@pins/common/src/client/api-client-error.js');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD }
	}
} = require('../../lib/views');
const { isExpeditedPart1Eligible } = require('#lib/is-expedited-part1-eligible');
const { FLAG } = require('@pins/common/src/feature-flags');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

/**
 * @param {boolean} checkSubmitted
 * @returns {import('express').Handler}
 */
module.exports =
	(checkSubmitted = true) =>
	async (req, res, next) => {
		const referenceId = req.params.referenceId;
		const encodedReferenceId = encodeURIComponent(referenceId);
		let result;

		const user = getUserFromSession(req);

		const appeal = await req.appealsApiClient.getUsersAppealCase({
			caseReference: encodedReferenceId,
			userId: user.id,
			role: LPA_USER_ROLE
		});

		if (checkSubmitted && !isLPAQuestionnaireOpen(appeal)) {
			req.session.navigationHistory.shift();
			return res.redirect('/' + DASHBOARD);
		}

		// lookup type by submission type code
		let journeyType = Object.values(JOURNEY_TYPES).find(
			(x) => x.type === JOURNEY_TYPE.questionnaire && x.caseType === appeal.appealTypeCode
		)?.id;

		const expeditedAppealsEnabled = await isLpaInFeatureFlag(
			appeal.LPACode,
			FLAG.EXPEDITED_APPEALS_FO_V2
		);

		const expeditedEligible = isExpeditedPart1Eligible({
			typeOfPlanningApplication: appeal?.typeOfPlanningApplication,
			applicationDate: appeal?.applicationDate,
			eligibility: {
				applicationDecision: appeal?.applicationDecision
			}
		});
		const expeditedConditions = expeditedAppealsEnabled && expeditedEligible;

		if (
			appeal.appealTypeCode === CASE_TYPES.S78.processCode &&
			(appeal.caseProcedure === 'writtenPart1' || expeditedConditions)
		) {
			journeyType = JOURNEY_TYPES.S78_QUESTIONNAIRE_PART_1.id;
		}

		if (typeof journeyType === 'undefined') {
			throw new Error('appealType is undefined');
		}

		try {
			const dbResponse = await req.appealsApiClient.getLPAQuestionnaire(referenceId);
			const convertedResponse = mapDBResponseToJourneyResponseFormat(dbResponse);
			result = new JourneyResponse(
				journeyType,
				referenceId,
				convertedResponse,
				dbResponse.AppealCase?.LPACode
			);
		} catch (err) {
			if (err instanceof ApiClientError && err.code === 404) {
				logger.debug('questionnaire not found, creating and returning default response');
				await req.appealsApiClient.postLPAQuestionnaire(referenceId);
			} else {
				logger.error(err);
			}
			// return default response
			result = getDefaultResponse(journeyType, referenceId, user.lpaCode);
		}

		if (result.LPACode !== user.lpaCode) {
			return res.status(404).render('error/not-found');
		}

		res.locals.journeyResponse = result;

		return next();
	};

/**
 * returns a default response for a journey
 * @param {import('../controller').JourneyType} journeyId - the type of journey
 * @param {string} referenceId - unique ref used in journey url
 * @param {string} lpaCode - the lpa code the journey response belongs to
 * @returns {JourneyResponse}
 */
function getDefaultResponse(journeyId, referenceId, lpaCode) {
	return new JourneyResponse(journeyId, referenceId, null, lpaCode);
}
