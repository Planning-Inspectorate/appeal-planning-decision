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

const {
	getLPAStatementByAppealId,
	markStatementAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/lpa-statement-submission/service');

const ApiError = require('#errors/apiError');
const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const {
	// sendSubmissionReceivedEmailToAppellantV2,
	sendSubmissionReceivedEmailToLpaV2,
	sendCommentSubmissionConfirmationEmailToIp,
	sendLpaStatementSubmissionReceivedEmailToLpaV2,
	sendAppellantFinalCommentSubmissionEmailToAppellantV2,
	sendLPAFinalCommentSubmissionEmailToLPAV2
} = require('#lib/notify');
const { getUserById } = require('../../routes/v2/users/service');
const { SchemaValidator } = require('./validate');
const logger = require('#lib/logger');
const {
	getAppellantFinalCommentByAppealId,
	markAppellantFinalCommentAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/appellant-final-comment-submission/service');
const {
	getLPAFinalCommentByAppealId,
	markLPAFinalCommentAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/lpa-final-comment-submission/service');
const { getServiceUserByIdAndCaseReference } = require('../../routes/v2/service-users/service');

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

/**
 * @typedef {import('@prisma/client').InterestedPartySubmission} InterestedPartySubmission
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

		logger.info(`sending appeal submitted email for ${appellantSubmission.appealId}`);

		try {
			await sendSubmissionReceivedEmailToLpaV2(appellantSubmission, email);
		} catch (err) {
			logger.error({ err }, 'failed to sendSubmissionReceivedEmailToLpaV2');
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
		let mappedData;
		// todo: temporary check until integration work for s78 is done
		if (appealTypeCode === 'HAS') {
			logger.info(`mapping lpaq ${caseReference} to ${appealTypeCode} schema`);
			mappedData = await formatters.questionnaire[appealTypeCodeToAppealId[appealTypeCode]](
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

		await markQuestionnaireAsSubmitted(
			caseReference,
			mappedData?.casedata?.lpaQuestionnaireSubmittedDate
		);

		return result;
	}

	/**
	 * @param {InterestedPartySubmission} interestedPartySubmission
	 * @returns {Promise<void>}
	 */
	async submitInterestedPartySubmission(interestedPartySubmission) {
		// const isBOIntegrationActive = await isFeatureActive(
		// 	FLAG.APPEALS_BO_SUBMISSION,
		// 	lpaCode
		// );
		// if (!isBOIntegrationActive) return;

		// Note - mapping to be implemented in future

		// logger.info(
		// 	`mapping interested party submission ${interestedPartySubmission.id} to schema`
		// );
		// const mappedData = await formatters.interestedPartyComment(interestedPartySubmission);
		// logger.debug({ mappedData }, 'mapped appeal');

		// NOTE - consider whether validation required

		logger.info(
			`forwarding interested party submission ${interestedPartySubmission.id} to service bus`
		);
		// const result = await forwarders.interestedPartyComment([mappedData]);

		if (interestedPartySubmission.emailAddress) {
			logger.info(
				`sending interested party comment submitted emails for ${interestedPartySubmission.id}`
			);

			try {
				await sendCommentSubmissionConfirmationEmailToIp(interestedPartySubmission);
			} catch (err) {
				logger.error({ err }, 'failed to sendCommentSubmissionConfirmationEmailToIp');
				throw new Error('failed to send interested party comment submission email');
			}
		}
	}

	/**
	 * @param {string} appealCaseReference
	 * @returns {Promise<void>}
	 */
	async submitLPAStatementSubmission(appealCaseReference) {
		const lpaStatement = await getLPAStatementByAppealId(appealCaseReference);

		logger.info(`forwarding lpa statement submission for ${appealCaseReference} to service bus`);

		// Date to be set in back office mapper once data model confirmed
		await markStatementAsSubmitted(appealCaseReference, new Date().toISOString());

		try {
			await sendLpaStatementSubmissionReceivedEmailToLpaV2(lpaStatement);
		} catch (err) {
			logger.error({ err }, 'failed to sendLpaStatementSubmissionReceivedEmailToLpaV2');
			throw new Error('failed to send lpa statement submission email');
		}
	}

	/**
	 * @param {string} caseReference
	 * @returns {Promise<void>}
	 */
	async submitLPAFinalCommentSubmission(caseReference) {
		const lpaFinalCommentSubmission = await getLPAFinalCommentByAppealId(caseReference);

		logger.info(`forwarding lpa final comment submission for ${caseReference} to service bus`);

		// Date to be set in back office mapper once data model confirmed
		await markLPAFinalCommentAsSubmitted(caseReference, new Date().toISOString());

		try {
			await sendLPAFinalCommentSubmissionEmailToLPAV2(lpaFinalCommentSubmission);
		} catch (err) {
			logger.error({ err }, 'failed to sendLPAFinalCommentSubmissionEmailToLPAV2');
			throw new Error('failed to send lpa final comment submission email');
		}
	}

	/**
	 * @param {string} caseReference
	 * @param {string} userId
	 * @returns {Promise<void>}
	 */
	async submitAppellantFinalCommentSubmission(caseReference, userId) {
		const appellantFinalCommentSubmission = await getAppellantFinalCommentByAppealId(caseReference);

		const { email, serviceUserId } = await getUserById(userId);

		let appellantName;

		if (serviceUserId) {
			const serviceUserDetails = await getServiceUserByIdAndCaseReference(
				serviceUserId,
				caseReference
			);

			if (serviceUserDetails?.firstName && serviceUserDetails?.lastName) {
				appellantName = serviceUserDetails.firstName + ' ' + serviceUserDetails.lastName;
			} else {
				appellantName = 'Appellant';
			}
		} else {
			appellantName = 'Appellant';
		}

		logger.info(
			`forwarding appellant final comment submission for ${caseReference} to service bus`
		);

		// Date to be set in back office mapper once data model confirmed
		await markAppellantFinalCommentAsSubmitted(caseReference, new Date().toISOString());

		try {
			await sendAppellantFinalCommentSubmissionEmailToAppellantV2(
				appellantFinalCommentSubmission,
				email,
				appellantName
			);
		} catch (err) {
			logger.error({ err }, 'failed to sendAppellantFinalCommentSubmissionEmailToAppellantV2');
			throw new Error('failed to send appellant final comment submission email');
		}
	}
}

module.exports = BackOfficeV2Service;
