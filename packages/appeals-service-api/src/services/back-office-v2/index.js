const { getAppeal } = require('../appeal.service');
const { isFeatureActive } = require('../../configuration/featureFlag');
const formatters = require('./formatters');
const forwarders = require('./forwarders');
const { FLAG } = require('@pins/common/src/feature-flags');
const {
	getLPAQuestionnaireByAppealId
} = require('../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/service');
const ApiError = require('#errors/apiError');

/**
 * @typedef {import('../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 */

class BackOfficeV2Service {
	constructor() {}

	/**
	 * @param {string} appealId
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitAppeal(appealId) {
		const appeal = await getAppeal(appealId);

		if (!appeal) throw new Error(`Appeal ${appealId} not found`);

		const isBOIntegrationActive = await isFeatureActive(FLAG.APPEALS_BO_SUBMISSION, appeal.lpaCode);
		if (!isBOIntegrationActive) return;

		if (!appeal.appealType)
			throw new Error(`Appeal type could not be determined on appeal ${appealId}`);

		return await forwarders.appeal(formatters.appeal[appeal.appealType](appeal));
	}

	/**
	 * @param {string} caseReference
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitQuestionnaire(caseReference) {
		const questionnaire = await getLPAQuestionnaireByAppealId(caseReference);

		if (!questionnaire) {
			throw ApiError.questionnaireNotFound();
		}

		const isBOIntegrationActive = await isFeatureActive(
			FLAG.APPEALS_BO_SUBMISSION,
			questionnaire.AppealCase.LPACode
		);
		if (!isBOIntegrationActive) return;

		// Need to find a way to get that 1001 programmatically
		return await forwarders.questionnaire(
			formatters.questionnaire[1001](caseReference, questionnaire)
		);
	}
}

module.exports = BackOfficeV2Service;
