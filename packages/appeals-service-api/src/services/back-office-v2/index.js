const { isFeatureActive } = require('../../configuration/featureFlag');
const formatters = require('./formatters');
const forwarders = require('./forwarders');
const { FLAG } = require('@pins/common/src/feature-flags');
const {
	getLPAQuestionnaireByAppealId,
	markQuestionnaireAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/service');

const { get, markAppealAsSubmitted } = require('../../routes/v2/appellant-submissions/_id/service');

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
	 * @param {string} appellantSubmissionId
	 * @param {string} userId
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitAppeal(appellantSubmissionId, userId) {
		const appeal = await get({
			appellantSubmissionId,
			userId
		});

		if (!appeal) throw new Error(`Appeal ${appellantSubmissionId} not found`);

		const isBOIntegrationActive = await isFeatureActive(FLAG.APPEALS_BO_SUBMISSION);
		if (!isBOIntegrationActive) return;

		if (!appeal.appealTypeCode)
			throw new Error(`Appeal type could not be determined on appeal ${appellantSubmissionId}`);

		const result = await forwarders.appeal(formatters.appeal[appeal.appealTypeCode](appeal));

		await markAppealAsSubmitted(appeal.id);

		return result;
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

		const result = await forwarders.questionnaire(
			await formatters.questionnaire[appealTypeCodeToAppealId[appealTypeCode]](
				caseReference,
				questionnaire
			)
		);

		await markQuestionnaireAsSubmitted(questionnaire.id);

		return result;
	}
}

module.exports = BackOfficeV2Service;
