const { getAppeal } = require('../appeal.service');
const { isFeatureActive } = require('../../configuration/featureFlag');
const formatters = require('./formatters');
const forwarders = require('./forwarders');
const { FLAG } = require('@pins/common/src/feature-flags');
const {
	getLPAQuestionnaireByAppealId
} = require('../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/service');
const ApiError = require('#errors/apiError');
const { APPEAL_ID } = require('@pins/business-rules/src/constants');

/**
 * @typedef {import('../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {"HAS" | "S78"} AppealTypeCode
 */

/** @type {Record<AppealTypeCode, string>} */
const appealTypeCodeToAppealId = {
	HAS: APPEAL_ID.HOUSEHOLDER,
	S78: APPEAL_ID.PLANNING_SECTION_78
};

/** @type {(maybeTypeCode: string) => maybeTypeCode is AppealTypeCode} */
const isValidAppealTypeCode = (maybeTypeCode) =>
	Object.keys(appealTypeCodeToAppealId).includes(maybeTypeCode);

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

		const { LPACode, appealTypeCode } = questionnaire.AppealCase;

		const isBOIntegrationActive = await isFeatureActive(FLAG.APPEALS_BO_SUBMISSION, LPACode);
		if (!isBOIntegrationActive) return;

		if (!isValidAppealTypeCode(appealTypeCode))
			throw new Error("Questionnaire's associated AppealCase has an invalid appealTypeCode");

		// Need to find a way to get that 1001 programmatically
		return await forwarders.questionnaire(
			formatters.questionnaire[appealTypeCodeToAppealId[appealTypeCode]](
				caseReference,
				questionnaire
			)
		);
	}
}

module.exports = BackOfficeV2Service;
