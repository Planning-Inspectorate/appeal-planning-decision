const forwarders = require('./forwarders');
const {
	markQuestionnaireAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/service');

const { markAppealAsSubmitted } = require('../../routes/v2/appellant-submissions/_id/service');

const {
	getLPAStatementByAppealId,
	markStatementAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/lpa-statement-submission/service');

const {
	sendSubmissionReceivedEmailToAppellantV2,
	sendSubmissionReceivedEmailToLpaV2,
	sendCommentSubmissionConfirmationEmailToIp,
	sendLpaStatementSubmissionReceivedEmailToLpaV2,
	sendAppellantFinalCommentSubmissionEmailToAppellantV2,
	sendAppellantProofEvidenceSubmissionEmailToAppellantV2,
	sendLPAProofEvidenceSubmissionEmailToLPAV2,
	sendRule6ProofEvidenceSubmissionEmailToRule6PartyV2,
	sendRule6StatementSubmissionEmailToRule6PartyV2,
	sendLPAFinalCommentSubmissionEmailToLPAV2,
	sendLPAHASQuestionnaireSubmittedEmailV2
} = require('#lib/notify');
const { getUserById } = require('../../routes/v2/users/service');
const { SchemaValidator } = require('./validate');
const logger = require('#lib/logger');
const {
	getAppellantFinalCommentByAppealId,
	markAppellantFinalCommentAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/appellant-final-comment-submission/service');
const {
	getAppellantProofOfEvidenceByAppealId,
	markAppellantProofOfEvidenceAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/appellant-proof-evidence-submission/service');
const {
	getRule6ProofOfEvidenceByAppealId,
	markRule6ProofOfEvidenceAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/rule-6-proof-evidence-submission/service');
const {
	getRule6StatementByAppealId,
	markRule6StatementAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/rule-6-statement-submission/service');
const {
	getLPAFinalCommentByAppealId,
	markLPAFinalCommentAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/lpa-final-comment-submission/service');
const {
	getLpaProofOfEvidenceByAppealId,
	markLpaProofOfEvidenceAsSubmitted
} = require('../../routes/v2/appeal-cases/_caseReference/lpa-proof-evidence-submission/service');
const { getForEmailCaseAndType } = require('../../routes/v2/service-users/service');
const { getCaseAndAppellant } = require('../../routes/v2/appeal-cases/service');
const { SERVICE_USER_TYPE, APPEAL_REPRESENTATION_TYPE } = require('pins-data-model');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');

/**
 * @template Payload
 * @typedef {import('./validate').Validate<Payload>} Validate
 */

/**
 * @typedef {import('../../routes/v2/appeal-cases/_caseReference/lpa-questionnaire-submission/questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import('../../routes/v2/appellant-submissions/_id/service').FullAppellantSubmission} FullAppellantSubmission
 * @typedef {"HAS" | "S78"} AppealTypeCode
 * @typedef {import ('pins-data-model').Schemas.AppellantSubmissionCommand} AppellantSubmissionCommand
 * @typedef {import ('pins-data-model').Schemas.LPAQuestionnaireCommand} LPAQuestionnaireCommand
 * @typedef {import ('pins-data-model').Schemas.AppealRepresentationSubmission} AppealRepresentationSubmission
 * @typedef {import('./formatters/s78/representation').TypedRepresentationSubmission} TypedRepresentationSubmission
 * @typedef {import('./formatters/s78/representation').RepresentationTypes} RepresentationTypes
 * @typedef {import('./formatters/s78/representation').RepresentationFormatterParams} RepresentationFormatterParams
 */

/**
 * @typedef {import('../../routes/v2/interested-party-submissions/repo').DetailedInterestedPartySubmission} DetailedInterestedPartySubmission
 * @typedef {import('../../models/entities/lpa-entity')} LPA
 * @typedef {import('./formatters/utils').AppellantSubmissionMapper} AppellantSubmissionMapper
 */

const { getValidator } = new SchemaValidator();

/** @type {(maybeTypeCode: string) => maybeTypeCode is AppealTypeCode} */
const isValidAppealTypeCode = (maybeTypeCode) =>
	[CASE_TYPES.HAS.processCode, CASE_TYPES.S78.processCode, CASE_TYPES.S20.processCode].includes(
		maybeTypeCode
	);

class BackOfficeV2Service {
	constructor() {}

	/**
	 * @param {{ appellantSubmission: FullAppellantSubmission, email: string, lpa: LPA, formatter: AppellantSubmissionMapper}} params
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitAppellantSubmission({ appellantSubmission, email, lpa, formatter }) {
		if (!isValidAppealTypeCode(appellantSubmission.appealTypeCode))
			throw new Error(`Appeal submission ${appellantSubmission.id} has an invalid appealTypeCode`);

		logger.info(
			`mapping appeal ${appellantSubmission.appealId} to ${appellantSubmission.appealTypeCode} schema`
		);
		const mappedData = await formatter(appellantSubmission, lpa);
		logger.debug({ mappedData }, 'mapped appeal');

		logger.info(`validating appeal ${appellantSubmission.appealId} schema`);
		/** @type {Validate<AppellantSubmissionCommand>} */
		const validator = getValidator('appellant-submission');
		// TODO: remove s20 check when data model/ schema confirmed
		if (
			appellantSubmission.appealTypeCode !== CASE_TYPES.S20.processCode &&
			!validator(mappedData)
		) {
			throw new Error(
				`Payload was invalid when checked against appellant submission command schema`
			);
		}

		logger.info(`forwarding appeal ${appellantSubmission.appealId} to service bus`);
		const result = await forwarders.appeal([mappedData]);

		await markAppealAsSubmitted(appellantSubmission.id);

		logger.info(`sending appeal submitted email for ${appellantSubmission.appealId}`);

		try {
			await sendSubmissionReceivedEmailToLpaV2(appellantSubmission);
		} catch (err) {
			logger.error({ err }, 'failed to sendSubmissionReceivedEmailToLpaV2');
			throw new Error('failed to send submission email to LPA');
		}

		try {
			await sendSubmissionReceivedEmailToAppellantV2(appellantSubmission, email);
		} catch (err) {
			logger.error({ err }, 'failed to sendSubmissionReceivedEmailToAppellantV2');
			throw new Error('failed to send submission email to appellant');
		}

		return result;
	}

	/**
	 * @param {string} caseReference
	 * @param {LPAQuestionnaireSubmission} questionnaire
	 * @param {function(string, LPAQuestionnaireSubmission): *} formatter
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitQuestionnaire(caseReference, questionnaire, formatter) {
		const { appealTypeCode } = questionnaire.AppealCase;

		if (!isValidAppealTypeCode(appealTypeCode))
			throw new Error("Questionnaire's associated AppealCase has an invalid appealTypeCode");

		logger.info(`mapping lpaq ${caseReference} to ${appealTypeCode} schema`);
		const mappedData = await formatter(caseReference, questionnaire);
		logger.debug({ mappedData }, 'mapped lpaq');

		logger.info(`validating lpaq ${caseReference} schema`);

		/** @type {Validate<LPAQuestionnaireCommand>} */
		const validator = getValidator('lpa-questionnaire');
		if (!validator(mappedData)) {
			throw new Error(`Payload was invalid when checked against lpa questionnaire command schema`);
		}

		logger.info(`forwarding lpaq ${caseReference} to service bus`);

		const result = await forwarders.questionnaire([mappedData]);

		await markQuestionnaireAsSubmitted(
			caseReference,
			mappedData?.casedata?.lpaQuestionnaireSubmittedDate
		);

		logger.info(`sending lpa questionnaire submitted email for ${caseReference}`);

		try {
			const appealCase = await getCaseAndAppellant({ caseReference });

			let user = appealCase?.users?.find(
				(user) => user.serviceUserType === SERVICE_USER_TYPE.AGENT
			);
			if (!user) {
				user = appealCase?.users?.find(
					(user) => user.serviceUserType === SERVICE_USER_TYPE.APPELLANT
				);
			}

			const appellantOrAgentEmailAddress = user?.emailAddress;

			await sendLPAHASQuestionnaireSubmittedEmailV2(appealCase, appellantOrAgentEmailAddress);
		} catch (err) {
			logger.error({ err }, 'failed to sendLPAQuestionnaireSubmittedEmailV2');
			throw new Error('failed to send LPA questionnaire submission email');
		}

		return result;
	}

	/**
	 * @param {DetailedInterestedPartySubmission} interestedPartySubmission
	 * @param {function(RepresentationFormatterParams): *} formatter
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitInterestedPartySubmission(interestedPartySubmission, formatter) {
		const { appealTypeCode } = interestedPartySubmission.AppealCase;
		const { caseReference, id } = interestedPartySubmission;

		if (!isValidAppealTypeCode(appealTypeCode))
			throw new Error(
				'Interested Party Comment associated AppealCase has an invalid appealTypeCode'
			);

		logger.info(`mapping interested party submission ${id} to schema`);

		const mappedData = await formatter({
			caseReference,
			repType: APPEAL_REPRESENTATION_TYPE.COMMENT,
			party: APPEAL_USER_ROLES.INTERESTED_PARTY,
			representationSubmission: interestedPartySubmission
		});
		logger.debug({ mappedData }, 'mapped representation');

		logger.info(`validating interested party comment ${id} representation schema`);

		/** @type {Validate<AppealRepresentationSubmission>} */
		const validator = getValidator('appeal-representation-submission');
		if (!validator(mappedData)) {
			throw new Error(
				`Payload was invalid when checked against appeal representation submission schema`
			);
		}

		logger.info(`forwarding interested party submission ${id} of ${caseReference} to service bus`);

		const result = await forwarders.representation([mappedData]);

		if (interestedPartySubmission.emailAddress) {
			logger.info(`sending interested party comment submitted emails for ${id}`);

			try {
				await sendCommentSubmissionConfirmationEmailToIp(interestedPartySubmission);
			} catch (err) {
				logger.error({ err }, 'failed to sendCommentSubmissionConfirmationEmailToIp');
				throw new Error('failed to send interested party comment submission email');
			}
		}
		return result;
	}

	/**
	 * @param {string} caseReference
	 * @param {function(RepresentationFormatterParams): *} formatter
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitLPAStatementSubmission(caseReference, formatter) {
		const lpaStatement = await getLPAStatementByAppealId(caseReference);

		if (!lpaStatement) throw new Error('No lpa statement found');

		const { appealTypeCode } = lpaStatement.AppealCase;

		if (!isValidAppealTypeCode(appealTypeCode))
			throw new Error('LPA statement associated AppealCase has an invalid appealTypeCode');

		let result;
		let mappedData;
		if (appealTypeCode === CASE_TYPES.S78.processCode) {
			logger.info(`mapping lpa statement ${caseReference} to ${appealTypeCode} schema`);
			mappedData = await formatter({
				caseReference,
				repType: APPEAL_REPRESENTATION_TYPE.STATEMENT,
				party: LPA_USER_ROLE,
				representationSubmission: lpaStatement
			});
			logger.debug({ mappedData }, 'mapped representation');

			logger.info(`validating representation ${caseReference} schema`);

			/** @type {Validate<AppealRepresentationSubmission>} */
			const validator = getValidator('appeal-representation-submission');
			if (!validator(mappedData)) {
				throw new Error(
					`Payload was invalid when checked against appeal representation submission schema`
				);
			}

			logger.info(`forwarding lpa statement submission for ${caseReference} to service bus`);

			result = await forwarders.representation([mappedData]);
		}

		// Date to be set in back office mapper once data model confirmed
		await markStatementAsSubmitted(caseReference, new Date().toISOString());

		try {
			await sendLpaStatementSubmissionReceivedEmailToLpaV2(lpaStatement);
		} catch (err) {
			logger.error({ err }, 'failed to sendLpaStatementSubmissionReceivedEmailToLpaV2');
			throw new Error('failed to send lpa statement submission email');
		}
		return result;
	}

	/**
	 * @param {string} caseReference
	 * @param {function(RepresentationFormatterParams): *} formatter
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitLPAFinalCommentSubmission(caseReference, formatter) {
		const lpaFinalCommentSubmission = await getLPAFinalCommentByAppealId(caseReference);

		if (!lpaFinalCommentSubmission) throw new Error('No lpa final comments found');

		const { appealTypeCode } = lpaFinalCommentSubmission.AppealCase;

		if (!isValidAppealTypeCode(appealTypeCode))
			throw new Error('LPA final comments associated AppealCase has an invalid appealTypeCode');

		let result;
		let mappedData;
		if (appealTypeCode === CASE_TYPES.S78.processCode) {
			logger.info(`mapping lpa final comment ${caseReference} to ${appealTypeCode} schema`);
			mappedData = await formatter({
				caseReference,
				repType: APPEAL_REPRESENTATION_TYPE.FINAL_COMMENT,
				party: LPA_USER_ROLE,
				representationSubmission: lpaFinalCommentSubmission
			});
			logger.debug({ mappedData }, 'mapped representation');

			logger.info(`validating representation ${caseReference} schema`);

			/** @type {Validate<AppealRepresentationSubmission>} */
			const validator = getValidator('appeal-representation-submission');
			if (!validator(mappedData)) {
				throw new Error(
					`Payload was invalid when checked against appeal representation submission schema`
				);
			}

			logger.info(`forwarding lpa final comment submission for ${caseReference} to service bus`);

			result = await forwarders.representation([mappedData]);
		}

		// Date to be set in back office mapper once data model confirmed
		await markLPAFinalCommentAsSubmitted(caseReference, new Date().toISOString());

		try {
			await sendLPAFinalCommentSubmissionEmailToLPAV2(lpaFinalCommentSubmission);
		} catch (err) {
			logger.error({ err }, 'failed to sendLPAFinalCommentSubmissionEmailToLPAV2');
			throw new Error('failed to send lpa final comment submission email');
		}
		return result;
	}

	/**
	 * @param {string} caseReference
	 * @param {function(RepresentationFormatterParams): *} formatter
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitLpaProofEvidenceSubmission(caseReference, formatter) {
		const lpaProofEvidenceSubmission = await getLpaProofOfEvidenceByAppealId(caseReference);

		if (!lpaProofEvidenceSubmission) throw new Error('No lpa proof of evidence found');

		const { appealTypeCode } = lpaProofEvidenceSubmission.AppealCase;

		if (!isValidAppealTypeCode(appealTypeCode))
			throw new Error('LPA proof of evidence associated AppealCase has an invalid appealTypeCode');

		let result;
		let mappedData;
		if (appealTypeCode === CASE_TYPES.S78.processCode) {
			logger.info(`mapping lpa proof of evidence ${caseReference} to ${appealTypeCode} schema`);
			mappedData = await formatter({
				caseReference,
				repType: APPEAL_REPRESENTATION_TYPE.PROOFS_EVIDENCE,
				party: LPA_USER_ROLE,
				representationSubmission: lpaProofEvidenceSubmission
			});
			logger.debug({ mappedData }, 'mapped representation');

			logger.info(`validating representation ${caseReference} schema`);

			/** @type {Validate<AppealRepresentationSubmission>} */
			const validator = getValidator('appeal-representation-submission');
			if (!validator(mappedData)) {
				throw new Error(
					`Payload was invalid when checked against appeal representation submission schema`
				);
			}

			logger.info(`forwarding lpa proof evidence submission for ${caseReference} to service bus`);

			result = await forwarders.representation([mappedData]);
		}

		// Date to be set in back office mapper once data model confirmed
		await markLpaProofOfEvidenceAsSubmitted(caseReference, new Date().toISOString());

		try {
			await sendLPAProofEvidenceSubmissionEmailToLPAV2(lpaProofEvidenceSubmission);
		} catch (err) {
			logger.error({ err }, 'failed to sendLpaProofEvidenceSubmissionEmailToLPAV2');
			throw new Error('failed to send lpa proof evidence submission email');
		}

		return result;
	}

	/**
	 * @param {string} caseReference
	 * @param {string} userId
	 * @param {function(RepresentationFormatterParams): *} formatter
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitAppellantFinalCommentSubmission(caseReference, userId, formatter) {
		const appellantFinalCommentSubmission = await getAppellantFinalCommentByAppealId(caseReference);

		if (!appellantFinalCommentSubmission) {
			throw new Error('No appellant final comments found');
		}

		const { appealTypeCode } = appellantFinalCommentSubmission.AppealCase;
		const { email } = await getUserById(userId);

		logger.info(
			`${userId} - ${email} submitting appellantFinalCommentSubmission for ${caseReference}`
		);

		const serviceUser = await getForEmailCaseAndType(email, caseReference, [
			SERVICE_USER_TYPE.APPELLANT,
			SERVICE_USER_TYPE.AGENT
		]);

		if (!serviceUser) throw new Error('cannot find appellant service user');

		let result;
		let mappedData;
		if (appealTypeCode === CASE_TYPES.S78.processCode) {
			logger.info(`mapping appellant final comment ${caseReference} to ${appealTypeCode} schema`);
			mappedData = await formatter({
				caseReference,
				serviceUserId: serviceUser.id,
				repType: APPEAL_REPRESENTATION_TYPE.FINAL_COMMENT,
				party: APPEAL_USER_ROLES.APPELLANT,
				representationSubmission: appellantFinalCommentSubmission
			});
			logger.debug({ mappedData }, 'mapped representation');

			logger.info(`validating representation ${caseReference} schema`);

			/** @type {Validate<AppealRepresentationSubmission>} */
			const validator = getValidator('appeal-representation-submission');
			if (!validator(mappedData)) {
				throw new Error(
					`Payload was invalid when checked against appeal representation submission schema`
				);
			}

			logger.info(
				`forwarding appellant final comment representation ${caseReference} to service bus`
			);

			result = await forwarders.representation([mappedData]);
		}

		// Date to be set in back office mapper once data model confirmed
		await markAppellantFinalCommentAsSubmitted(caseReference, new Date().toISOString());

		try {
			await sendAppellantFinalCommentSubmissionEmailToAppellantV2(
				appellantFinalCommentSubmission,
				email
			);
		} catch (err) {
			logger.error({ err }, 'failed to sendAppellantFinalCommentSubmissionEmailToAppellantV2');
			throw new Error('failed to send appellant final comment submission email');
		}

		return result;
	}

	/**
	 * @param {string} caseReference
	 * @param {string} userId
	 * @param {function(RepresentationFormatterParams): *} formatter
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitAppellantProofEvidenceSubmission(caseReference, userId, formatter) {
		const appellantProofEvidenceSubmission = await getAppellantProofOfEvidenceByAppealId(
			caseReference
		);

		if (!appellantProofEvidenceSubmission) {
			throw new Error('No appellant proofs of evidence found');
		}

		const { appealTypeCode } = appellantProofEvidenceSubmission.AppealCase;

		if (!isValidAppealTypeCode(appealTypeCode))
			throw new Error(
				'Appellant proofs of evidence associated AppealCase has an invalid appealTypeCode'
			);

		const { email } = await getUserById(userId);

		logger.info(
			`${userId} - ${email} submitting appellantProofEvidenceSubmission for ${caseReference}`
		);

		const serviceUser = await getForEmailCaseAndType(email, caseReference, [
			SERVICE_USER_TYPE.APPELLANT,
			SERVICE_USER_TYPE.AGENT
		]);

		if (!serviceUser) throw new Error('cannot find appellant service user');

		const appellantName = this.#getNameFromServiceUser(serviceUser) || 'Appellant';

		logger.info(`mapping appellant proofs for ${caseReference} to ${appealTypeCode} schema`);
		const mappedData = await formatter({
			caseReference,
			serviceUserId: serviceUser.id,
			repType: APPEAL_REPRESENTATION_TYPE.PROOFS_EVIDENCE,
			party: APPEAL_USER_ROLES.APPELLANT,
			representationSubmission: appellantProofEvidenceSubmission
		});
		logger.debug({ mappedData }, 'mapped representation');

		logger.info(`validating representation ${caseReference} schema`);

		/** @type {Validate<AppealRepresentationSubmission>} */
		const validator = getValidator('appeal-representation-submission');
		if (!validator(mappedData)) {
			throw new Error(
				`Payload was invalid when checked against appeal representation submission schema`
			);
		}

		logger.info(
			`forwarding appellant proof of evidence submission for ${caseReference} to service bus`
		);

		const result = await forwarders.representation([mappedData]);

		// Date to be set in back office mapper once data model confirmed
		await markAppellantProofOfEvidenceAsSubmitted(caseReference, new Date().toISOString());

		try {
			await sendAppellantProofEvidenceSubmissionEmailToAppellantV2(
				appellantProofEvidenceSubmission,
				email,
				appellantName
			);
		} catch (err) {
			logger.error({ err }, 'failed to sendAppellantProofEvidenceSubmissionEmailToAppellantV2');
			throw new Error('failed to send appellant proof of evidence submission email');
		}

		return result;
	}

	/**
	 * @param {string} caseReference
	 * @param {string} userId
	 * @param {function(RepresentationFormatterParams): *} formatter
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitRule6ProofOfEvidenceSubmission(caseReference, userId, formatter) {
		const rule6ProofOfEvidenceSubmission = await getRule6ProofOfEvidenceByAppealId(
			userId,
			caseReference
		);

		if (!rule6ProofOfEvidenceSubmission) throw new Error('No rule 6 proof of evidence found');

		const { appealTypeCode } = rule6ProofOfEvidenceSubmission.AppealCase;

		if (!isValidAppealTypeCode(appealTypeCode))
			throw new Error('Rule 6 statement associated AppealCase has an invalid appealTypeCode');

		const { email } = await getUserById(userId);

		logger.info(
			`${userId} - ${email} submitting rule6ProofOfEvidenceSubmission for ${caseReference}`
		);

		const serviceUser = await getForEmailCaseAndType(email, caseReference, [
			SERVICE_USER_TYPE.RULE_6_PARTY
		]);

		if (!serviceUser) throw new Error('cannot find rule 6 user');

		logger.info(
			`mapping rule6 proof of evidence for case ${caseReference} to ${appealTypeCode} schema`
		);
		const mappedData = await formatter({
			caseReference,
			serviceUserId: serviceUser.id,
			repType: APPEAL_REPRESENTATION_TYPE.PROOFS_EVIDENCE,
			party: APPEAL_USER_ROLES.RULE_6_PARTY,
			representationSubmission: rule6ProofOfEvidenceSubmission
		});
		logger.debug({ mappedData }, 'mapped representation');

		logger.info(`validating representation ${caseReference} schema`);

		/** @type {Validate<AppealRepresentationSubmission>} */
		const validator = getValidator('appeal-representation-submission');
		if (!validator(mappedData)) {
			throw new Error(
				`Payload was invalid when checked against appeal representation submission schema`
			);
		}

		logger.info(
			`forwarding rule 6 party proof of evidence submission for ${caseReference} to service bus`
		);

		const result = await forwarders.representation([mappedData]);

		await markRule6ProofOfEvidenceAsSubmitted(userId, caseReference, new Date().toISOString());

		try {
			await sendRule6ProofEvidenceSubmissionEmailToRule6PartyV2(
				rule6ProofOfEvidenceSubmission,
				email
			);
		} catch (err) {
			logger.error({ err }, 'failed to sendRule6ProofOfEvidenceSubmissionEmailToRule6PartyV2');
			throw new Error('failed to send rule 6 proof of evidence submission email');
		}

		return result;
	}

	/**
	 * @param {string} caseReference
	 * @param {string} userId
	 * @param {function(RepresentationFormatterParams): *} formatter
	 * @returns {Promise<Array<*> | void>}
	 */
	async submitRule6StatementSubmission(caseReference, userId, formatter) {
		const rule6Statement = await getRule6StatementByAppealId(userId, caseReference);

		if (!rule6Statement) throw new Error('Rule 6 statement not found');

		const { appealTypeCode } = rule6Statement.AppealCase;

		if (!isValidAppealTypeCode(appealTypeCode))
			throw new Error('Rule 6 statement associated AppealCase has an invalid appealTypeCode');

		const { email } = await getUserById(userId);

		logger.info(`${userId} - ${email} submitting rule6Statement for ${caseReference}`);

		const serviceUser = await getForEmailCaseAndType(email, caseReference, [
			SERVICE_USER_TYPE.RULE_6_PARTY
		]);

		if (!serviceUser) throw new Error('cannot find rule 6 user');

		logger.info(`mapping rule6 statement ${caseReference} to ${appealTypeCode} schema`);
		const mappedData = await formatter({
			caseReference,
			serviceUserId: serviceUser.id,
			repType: APPEAL_REPRESENTATION_TYPE.STATEMENT,
			party: APPEAL_USER_ROLES.RULE_6_PARTY,
			representationSubmission: rule6Statement
		});
		logger.debug({ mappedData }, 'mapped representation');

		logger.info(`validating representation ${caseReference} schema`);

		/** @type {Validate<AppealRepresentationSubmission>} */
		const validator = getValidator('appeal-representation-submission');
		if (!validator(mappedData)) {
			throw new Error(
				`Payload was invalid when checked against appeal representation submission schema`
			);
		}

		logger.info(`forwarding rule 6 party statement submission for ${caseReference} to service bus`);

		const result = await forwarders.representation([mappedData]);

		await markRule6StatementAsSubmitted(userId, caseReference);

		try {
			await sendRule6StatementSubmissionEmailToRule6PartyV2(rule6Statement, email);
		} catch (err) {
			logger.error({ err }, 'failed to sendRule6StatementSubmissionEmailToRule6PartyV2');
			throw new Error('failed to send rule 6 statement submission email');
		}

		return result;
	}

	/**
	 * @param {import("#repositories/sql/service-user-repository").ServiceUser|null} serviceUserDetails
	 * @returns {string|null}
	 */
	#getNameFromServiceUser(serviceUserDetails) {
		if (serviceUserDetails?.firstName && serviceUserDetails?.lastName) {
			return serviceUserDetails.firstName + ' ' + serviceUserDetails.lastName;
		}

		return null;
	}
}

module.exports = BackOfficeV2Service;
