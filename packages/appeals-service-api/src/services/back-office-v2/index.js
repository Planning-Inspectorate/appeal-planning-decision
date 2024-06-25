const { isFeatureActive } = require('../../configuration/featureFlag');
const formatters = require('./formatters');
const forwarders = require('./forwarders');
const { FLAG } = require('@pins/common/src/feature-flags');
const {
	getLPAQuestionnaireByAppealId,
	markQuestionnaireAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/service');

const {
	markAppealAsSubmitted,
	getForBOSubmission
} = require('../../routes/v2/appellant-submissions/_id/service');

const ApiError = require('#errors/apiError');
const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const {
	sendSubmissionConfirmationEmailToAppellantV2,
	sendSubmissionReceivedEmailToLpaV2
} = require('#lib/notify');
const { getUserById } = require('../../routes/v2/users/service');
const { SchemaValidator } = require('./validate');
const logger = require('#lib/logger');

/**
 * @typedef {import('../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {"HAS" | "S78"} AppealTypeCode
 */

/**
 * @template Payload
 * @typedef {import('./validate').Validate<Payload>} Validate
 */

/**
 * @typedef {import ('pins-data-model').Schemas.AppellantSubmissionCommand} AppellantSubmissionCommand
 * @typedef {import ('pins-data-model').Schemas.LPAQuestionnaireCommand} LPAQuestionnaireCommand
 */

const { getValidator } = new SchemaValidator();

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
	 * @param {{ appellantSubmissionId: string, userId: string }} params
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitAppellantSubmission({ appellantSubmissionId, userId }) {
		const appellantSubmission = await getForBOSubmission({ appellantSubmissionId, userId });

		if (!appellantSubmission)
			throw new Error(`Appeal submission ${appellantSubmissionId} not found`);

		const { email } = await getUserById(userId);

		const isBOIntegrationActive = await isFeatureActive(
			FLAG.APPEALS_BO_SUBMISSION,
			appellantSubmission.LPACode
		);
		if (!isBOIntegrationActive) return;

		if (!isValidAppealTypeCode(appellantSubmission.appealTypeCode))
			throw new Error(`Appeal submission ${appellantSubmissionId} has an invalid appealTypeCode`);

		logger.info(
			`mapping appeal ${appellantSubmission.appealId} to ${appellantSubmission.appealTypeCode} schema`
		);
		const mappedData = await formatters.appeal[
			appealTypeCodeToAppealId[appellantSubmission.appealTypeCode]
		](appellantSubmission);
		logger.debug({ mappedData }, 'mapped appeal');

		logger.info(`validating appeal ${appellantSubmission.appealId} schema`);
		/** @type {Validate<AppellantSubmissionCommand>} */
		const validator = getValidator('appellant-submission');
		if (!validator(mappedData)) {
			throw new Error(
				`Payload was invalid when checked against appellant submission command schema`
			);
		}

		logger.info(`forwarding appeal ${appellantSubmission.appealId} to service bus`);
		const result = await forwarders.appeal([mappedData]);

		await markAppealAsSubmitted(appellantSubmission.id);

		logger.info(`sending appeal submitted emails for ${appellantSubmission.appealId}`);

		let emailFailed = false;
		try {
			await sendSubmissionConfirmationEmailToAppellantV2(appellantSubmission, email);
		} catch (err) {
			logger.error({ err }, 'failed to sendSubmissionConfirmationEmailToAppellantV2');
			emailFailed = true;
		}

		try {
			await sendSubmissionReceivedEmailToLpaV2(appellantSubmission, email);
		} catch (err) {
			logger.error({ err }, 'failed to sendSubmissionReceivedEmailToLpaV2');
			emailFailed = true;
		}

		if (emailFailed) {
			throw new Error('failed to send submission email');
		}

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

		let result;
		// todo: temporary check until integration work for s78 is done
		if (appealTypeCode === 'HAS') {
			logger.info(`mapping lpaq ${caseReference} to ${appealTypeCode} schema`);
			const mappedData = await formatters.questionnaire[appealTypeCodeToAppealId[appealTypeCode]](
				caseReference,
				questionnaire
			);
			logger.debug({ mappedData }, 'mapped lpaq');

			logger.info(`validating lpaq ${caseReference} schema`);

			/** @type {Validate<LPAQuestionnaireCommand>} */
			const validator = getValidator('lpa-questionnaire');
			if (!validator(mappedData)) {
				throw new Error(
					`Payload was invalid when checked against appellant submission command schema`
				);
			}

			logger.info(`forwarding lpaq ${caseReference} to service bus`);

			result = await forwarders.questionnaire([mappedData]);
		}

		await markQuestionnaireAsSubmitted(questionnaire.id);

		return result;
	}
}

module.exports = BackOfficeV2Service;
