const {
	config: {
		appeal: { type: appealTypeConfig }
	},
	rules
} = require('@pins/business-rules');
const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const NotifyService = require('@pins/common/src/lib/notify/notify-service');
const config = require('../configuration/config');
const logger = require('./logger');
const LpaService = require('../services/lpa.service');
const { parseISO } = require('date-fns');
const { formatInTimeZone } = require('date-fns-tz');
const ukTimeZone = 'Europe/London';
const constants = require('@pins/business-rules/src/constants');
const { formatSubmissionAddress, formatAddress } = require('@pins/common/src/lib/format-address');
const lpaService = new LpaService();
const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const { templates } = config.services.notify;
const { caseTypeLookup } = require('@pins/common/src/database/data-static');

/**
 * @typedef {import('@prisma/client').AppealCase } AppealCase
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import("@prisma/client").AppellantSubmission} AppellantSubmission
 * @typedef {import('../routes/v2/appellant-submissions/_id/service').FullAppellantSubmission} FullAppellantSubmission
 * @typedef {import('@prisma/client').InterestedPartySubmission} InterestedPartySubmission
 * @typedef {import('appeals-service-api').Api.LPAStatementSubmission} LPAStatementSubmission
 * @typedef {import('appeals-service-api').Api.LPAFinalCommentSubmission} LPAFinalCommentSubmission
 * @typedef {import('appeals-service-api').Api.AppellantFinalCommentSubmission} AppellantFinalCommentSubmission
 * @typedef {import('appeals-service-api').Api.AppellantProofOfEvidenceSubmission} AppellantProofOfEvidenceSubmission
 * @typedef {import('appeals-service-api').Api.LPAProofOfEvidenceSubmission} LPAProofOfEvidenceSubmission
 * @typedef {import('appeals-service-api').Api.Rule6ProofOfEvidenceSubmission} Rule6ProofOfEvidenceSubmission
 * @typedef {import('appeals-service-api').Api.Rule6StatementSubmission} Rule6StatementSubmission
 * @typedef {import('@prisma/client').ServiceUser} ServiceUser
 */

/** @type {NotifyService|null} */ // todo: use dependency injection instead
let notifyServiceInstance;
/** @returns {NotifyService} */
const getNotifyService = () => {
	if (notifyServiceInstance) return notifyServiceInstance;

	notifyServiceInstance = new NotifyService({
		logger,
		notifyClient: NotifyBuilder.getNotifyClient(
			config.services.notify.baseUrl,
			config.services.notify.serviceId,
			config.services.notify.apiKey
		)
	});

	return notifyServiceInstance;
};

//v1 appellant submission initial
const sendSubmissionConfirmationEmailToAppellant = async (appeal) => {
	try {
		const recipientEmail = appeal.email;
		const variables = {
			...config.services.notify.templateVariables,
			name:
				appeal.appealType == '1001'
					? appeal.aboutYouSection.yourDetails.name
					: appeal.contactDetailsSection.contact.name
		};

		const reference = appeal.id;

		logger.debug(
			{ recipientEmail, variables, reference },
			'Sending submission confirmation email to appellant'
		);

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.appealSubmission.v1Initial,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We have received your appeal`,
				content
			},
			destinationEmail: recipientEmail,
			templateId: templates.generic,
			reference
		});
	} catch (err) {
		logger.error(
			{ err, appealId: appeal.id },
			'Unable to send submission confirmation email to appellant'
		);
	}
};

// v1 appellant submission follow up
const sendSubmissionFollowUpEmailToAppellant = async (appeal) => {
	try {
		const lpa = await lpaService.getLpaById(appeal.lpaCode);
		const appealRef = appeal.horizonIdFull ?? 'ID not provided';

		const recipientEmail = appeal.email;
		const variables = {
			...config.services.notify.templateVariables,
			appealReferenceNumber: appealRef,
			appealSiteAddress: _formatAddress(appeal.appealSiteSection.siteAddress),
			lpaReference: appeal.planningApplicationNumber,
			lpaName: lpa.getName(),
			pdfLink: `${config.apps.appeals.baseUrl}/document/${appeal.id}/${appeal.appealSubmission.appealPDFStatement.uploadedFile.id}`
		};

		const reference = appeal.id;

		logger.debug(
			{ recipientEmail, variables, reference },
			'Sending submission received email to appellant'
		);

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.appealSubmission.v1FollowUp,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We have processed your appeal: ${variables.appealReferenceNumber}`,
				content
			},
			destinationEmail: recipientEmail,
			templateId: templates.generic,
			reference
		});
	} catch (err) {
		logger.error(
			{ err, appealId: appeal.id },
			'Unable to send submission received email to appellant'
		);
	}
};

/**
 *  v2 appellant submission initial
 * @param { FullAppellantSubmission } appellantSubmission
 * @param { string } email
 */
const sendSubmissionReceivedEmailToAppellantV2 = async (appellantSubmission, email) => {
	try {
		const recipientEmail = email;

		const address = appellantSubmission.SubmissionAddress[0];

		const formattedAddress = formatSubmissionAddress(address);

		const variables = {
			...config.services.notify.templateVariables,
			appealSiteAddress: formattedAddress,
			lpaReference: appellantSubmission.applicationReference
		};

		const reference = appellantSubmission.id;

		logger.debug(
			{ recipientEmail, variables, reference },
			'Sending submission received email to appellant'
		);

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.appealSubmission.v2Initial,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We have received your appeal`,
				content
			},
			destinationEmail: recipientEmail,
			templateId: templates.generic,
			reference
		});
	} catch (err) {
		logger.error(
			{ err, appealId: appellantSubmission.id },
			'Unable to send submission received email v2 to appellant'
		);
	}
};

/**
 * v2 appellant submission follow up
 * @param { AppealCase } appealCase
 * @param { AppellantSubmission } appellantSubmission
 * @param { string } email
 */
const sendSubmissionConfirmationEmailToAppellantV2 = async (
	appealCase,
	appellantSubmission,
	email
) => {
	try {
		const recipientEmail = email;
		const formattedAddress = formatSubmissionAddress({
			addressLine1: appealCase.siteAddressLine1,
			addressLine2: appealCase.siteAddressLine2,
			townCity: appealCase.siteAddressTown,
			county: appealCase.siteAddressCounty,
			postcode: appealCase.siteAddressPostcode
		});

		const variables = {
			...config.services.notify.templateVariables,
			appealReferenceNumber: appealCase.caseReference,
			appealSiteAddress: formattedAddress,
			lpaReference: appealCase.applicationReference,
			pdfLink: `${config.apps.appeals.baseUrl}/appeal-document/${appellantSubmission.id}`
		};

		const reference = appealCase.id;

		logger.debug(
			{ recipientEmail, variables, reference },
			'Sending submission confirmation email to appellant v2'
		);

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.appealSubmission.v2FollowUp,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We have processed your appeal: ${variables.appealReferenceNumber}`,
				content
			},
			destinationEmail: recipientEmail,
			templateId: templates.generic,
			reference
		});
	} catch (err) {
		logger.error(
			{ err, appealId: appealCase.id },
			'Unable to send submission confirmation email to appellant v2'
		);
	}
};

/**
 * @param { FullAppellantSubmission } appellantSubmission
 */
const sendSubmissionReceivedEmailToLpaV2 = async (appellantSubmission) => {
	try {
		let lpa;
		try {
			lpa = await lpaService.getLpaByCode(appellantSubmission.LPACode);
		} catch (err) {
			lpa = await lpaService.getLpaById(appellantSubmission.LPACode);
		}
		const lpaEmail = lpa.getEmail();

		const reference = appellantSubmission.id;

		const appealType = caseTypeLookup(
			appellantSubmission.appealTypeCode,
			'processCode'
		)?.type.toLowerCase();

		const variables = {
			...config.services.notify.templateVariables,
			loginUrl: `${config.apps.appeals.baseUrl}/manage-appeals/your-appeals`,
			lpaReference: appellantSubmission.applicationReference
		};

		logger.debug({ lpaEmail, variables, reference }, 'Sending email to LPA');

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.appealSubmission.v2LPANotification,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We have received a ${appealType} appeal`,
				content
			},
			destinationEmail: lpaEmail,
			templateId: templates.generic,
			reference
		});
	} catch (err) {
		logger.error(
			{ err, lpaCode: appellantSubmission.LPACode },
			'Unable to send submission received email to LPA'
		);
	}
};

/**
 * @param { LPAStatementSubmission } lpaStatementSubmission
 */
const sendLpaStatementSubmissionReceivedEmailToLpaV2 = async (lpaStatementSubmission) => {
	const {
		LPACode: lpaCode,
		caseReference,
		finalCommentsDueDate,
		siteAddressLine1,
		siteAddressLine2,
		siteAddressTown,
		siteAddressCounty,
		siteAddressPostcode,
		applicationReference
	} = lpaStatementSubmission.AppealCase;

	const formattedAddress = formatSubmissionAddress({
		addressLine1: siteAddressLine1,
		addressLine2: siteAddressLine2,
		townCity: siteAddressTown,
		county: siteAddressCounty,
		postcode: siteAddressPostcode
	});

	try {
		let lpa;
		try {
			lpa = await lpaService.getLpaByCode(lpaCode);
		} catch (err) {
			lpa = await lpaService.getLpaById(lpaCode);
		}
		const lpaEmail = lpa.getEmail();

		const reference = lpaStatementSubmission.id;
		// TODO: put inside an appeal model
		let variables = {
			...config.services.notify.templateVariables,
			appealReferenceNumber: caseReference,
			appealSiteAddress: formattedAddress,
			deadlineDate: finalCommentsDueDate
				? formatInTimeZone(finalCommentsDueDate, ukTimeZone, 'dd MMMM yyyy')
				: '',
			lpaReference: applicationReference
		};

		logger.debug({ lpaEmail, variables, reference }, 'Sending email to LPA');

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.representations.v2LpaStatement,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We've received your statement: ${caseReference}`,
				content
			},
			destinationEmail: lpaEmail,
			templateId: templates.generic,
			reference
		});
	} catch (err) {
		logger.error({ err, lpaCode: lpaCode }, 'Unable to send submission received email to LPA');
	}
};

/**
 * @param { LPAFinalCommentSubmission } lpaFinalCommentSubmission
 */
const sendLPAFinalCommentSubmissionEmailToLPAV2 = async (lpaFinalCommentSubmission) => {
	const {
		LPACode: lpaCode,
		finalCommentsDueDate,
		siteAddressLine1,
		siteAddressLine2,
		siteAddressTown,
		siteAddressCounty,
		siteAddressPostcode,
		applicationReference
	} = lpaFinalCommentSubmission.AppealCase;

	const caseReference = lpaFinalCommentSubmission.caseReference;

	const formattedAddress = formatSubmissionAddress({
		addressLine1: siteAddressLine1,
		addressLine2: siteAddressLine2,
		townCity: siteAddressTown,
		county: siteAddressCounty,
		postcode: siteAddressPostcode
	});

	try {
		let lpa;
		try {
			lpa = await lpaService.getLpaByCode(lpaCode);
		} catch (err) {
			lpa = await lpaService.getLpaById(lpaCode);
		}
		const lpaEmail = lpa.getEmail();

		const lpaName = lpa.getName();

		const reference = lpaFinalCommentSubmission.id;

		let variables = {
			...config.services.notify.templateVariables,
			LPA: lpaName,
			appealReferenceNumber: caseReference,
			appealSiteAddress: formattedAddress,
			deadlineDate: finalCommentsDueDate
				? formatInTimeZone(finalCommentsDueDate, ukTimeZone, 'dd MMMM yyyy')
				: '',
			lpaReference: applicationReference
		};

		logger.debug({ lpaEmail, variables, reference }, 'Sending email to LPA');

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.representations.v2LpaFinalComment,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We've received your final comments: ${caseReference}`,
				content
			},
			destinationEmail: lpaEmail,
			templateId: templates.generic,
			reference
		});
	} catch (err) {
		logger.error({ err, lpaCode: lpaCode }, 'Unable to send final comment submission email to LPA');
	}
};

/**
 * @param { LPAProofOfEvidenceSubmission } lpaProofEvidenceSubmission
 */
const sendLPAProofEvidenceSubmissionEmailToLPAV2 = async (lpaProofEvidenceSubmission) => {
	const {
		LPACode: lpaCode,
		applicationReference,
		proofsOfEvidenceDueDate,
		siteAddressLine1,
		siteAddressLine2,
		siteAddressTown,
		siteAddressCounty,
		siteAddressPostcode
	} = lpaProofEvidenceSubmission.AppealCase;

	const caseReference = lpaProofEvidenceSubmission.caseReference;

	const formattedAddress = formatSubmissionAddress({
		addressLine1: siteAddressLine1,
		addressLine2: siteAddressLine2,
		townCity: siteAddressTown,
		county: siteAddressCounty,
		postcode: siteAddressPostcode
	});

	try {
		let lpa;
		try {
			lpa = await lpaService.getLpaByCode(lpaCode);
		} catch (err) {
			lpa = await lpaService.getLpaById(lpaCode);
		}
		const lpaEmail = lpa.getEmail();

		const reference = lpaProofEvidenceSubmission.id;

		let variables = {
			...config.services.notify.templateVariables,
			appealReferenceNumber: caseReference,
			appealSiteAddress: formattedAddress,
			deadlineDate: proofsOfEvidenceDueDate
				? formatInTimeZone(proofsOfEvidenceDueDate, ukTimeZone, 'dd MMMM yyyy')
				: '',
			lpaReference: applicationReference
		};

		logger.debug({ lpaEmail, variables, reference }, 'Sending proof of evidence email to LPA');

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.representations.v2LpaProofsEvidence,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We've received your proof of evidence and witnesses: ${caseReference}`,
				content
			},
			destinationEmail: lpaEmail,
			templateId: templates.generic,
			reference
		});
	} catch (err) {
		logger.error(
			{ err, lpaCode: lpaCode },
			'Unable to send proof of evidence submission email to LPA'
		);
	}
};

/**
 * @param { AppealCaseDetailed } appealCase
 * @param { string } appellantOrAgentEmailAddress
 */
const sendLPAHASQuestionnaireSubmittedEmailV2 = async (
	appealCase,
	appellantOrAgentEmailAddress
) => {
	const { LPACode: lpaCode, caseReference, applicationReference, caseStartedDate } = appealCase;

	let lpa;
	try {
		lpa = await lpaService.getLpaByCode(lpaCode);
	} catch (err) {
		logger.warn({ err, lpaCode }, 'Failed to retrieve LPA by code, falling back to ID');
		lpa = await lpaService.getLpaById(lpaCode);
	}
	if (!lpa) {
		throw new Error(`LPA not found for code: ${lpaCode}`);
	}

	const lpaEmailAddress = lpa.getEmail();
	const lpaName = lpa.getName();

	const formattedAddress = formatAddress(appealCase);
	const formattedDate = caseStartedDate
		? formatInTimeZone(caseStartedDate, ukTimeZone, 'dd MMMM yyyy')
		: '';

	const url = `${config.apps.appeals.baseUrl}/lpa-questionnaire-document/${caseReference}`;

	const variables = {
		...config.services.notify.templateVariables,
		appealReferenceNumber: caseReference,
		lpaName: lpaName,
		lpaReference: applicationReference,
		siteAddress: formattedAddress,
		appealStartDate: formattedDate,
		questionnaireLink: url,
		appellantEmailAddress: appellantOrAgentEmailAddress
	};

	const reference = appealCase.id;

	logger.debug({ variables }, 'Sending HAS questionnaire submitted email to LPA');

	try {
		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.lpaq.v2LPAQSubmitted,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We've received your questionnaire: ${variables.appealReferenceNumber}`,
				content
			},
			destinationEmail: lpaEmailAddress,
			templateId: templates.generic,
			reference
		});
	} catch (err) {
		logger.error(
			{ err, lpaCode: lpaCode },
			'Unable to send HAS questionnaire submission email to LPA'
		);
	}
};

/**
 * @param { AppellantFinalCommentSubmission } appellantFinalCommentSubmission
 * @param {string} emailAddress
 */
const sendAppellantFinalCommentSubmissionEmailToAppellantV2 = async (
	appellantFinalCommentSubmission,
	emailAddress
) => {
	try {
		const recipientEmail = emailAddress;
		const {
			siteAddressLine1,
			siteAddressLine2,
			siteAddressTown,
			siteAddressCounty,
			siteAddressPostcode,
			finalCommentsDueDate,
			applicationReference
		} = appellantFinalCommentSubmission.AppealCase;

		const caseReference = appellantFinalCommentSubmission.caseReference;

		const formattedAddress = formatSubmissionAddress({
			addressLine1: siteAddressLine1,
			addressLine2: siteAddressLine2,
			townCity: siteAddressTown,
			county: siteAddressCounty,
			postcode: siteAddressPostcode
		});

		const reference = appellantFinalCommentSubmission.id;

		let variables = {
			...config.services.notify.templateVariables,
			appealReferenceNumber: caseReference,
			appealSiteAddress: formattedAddress,
			deadlineDate: finalCommentsDueDate
				? formatInTimeZone(finalCommentsDueDate, ukTimeZone, 'dd MMMM yyyy')
				: '',
			lpaReference: applicationReference
		};

		logger.debug({ variables }, 'Sending final comment email to appellant');

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.representations.v2AppellantFinalComment,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We have received your final comments: ${variables.appealReferenceNumber}`,
				content
			},
			destinationEmail: recipientEmail,
			templateId: templates.generic,
			reference
		});
	} catch (err) {
		logger.error({ err }, 'Unable to send final comment submission email to appellant');
	}
};

/**
 * @param { AppellantProofOfEvidenceSubmission } appellantProofEvidenceSubmission
 * @param {string} emailAddress
 */
const sendAppellantProofEvidenceSubmissionEmailToAppellantV2 = async (
	appellantProofEvidenceSubmission,
	emailAddress
) => {
	try {
		const {
			applicationReference,
			siteAddressLine1,
			siteAddressLine2,
			siteAddressTown,
			siteAddressCounty,
			siteAddressPostcode,
			proofsOfEvidenceDueDate
		} = appellantProofEvidenceSubmission.AppealCase;

		const caseReference = appellantProofEvidenceSubmission.caseReference;

		const formattedAddress = formatSubmissionAddress({
			addressLine1: siteAddressLine1,
			addressLine2: siteAddressLine2,
			townCity: siteAddressTown,
			county: siteAddressCounty,
			postcode: siteAddressPostcode
		});

		const reference = appellantProofEvidenceSubmission.id;

		let variables = {
			...config.services.notify.templateVariables,
			appealReferenceNumber: caseReference,
			siteAddress: formattedAddress,
			lpaReference: applicationReference || '',
			deadlineDate: proofsOfEvidenceDueDate
				? formatInTimeZone(proofsOfEvidenceDueDate, ukTimeZone, 'dd MMMM yyyy')
				: 'Not provided'
		};

		logger.debug({ variables }, 'Sending proof of evidence email to appellant');
		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.representations.v2ProofOfEvidenceSubmitted,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We have received your proof of evidence and witnesses: ${variables.appealReferenceNumber}`,
				content
			},
			destinationEmail: emailAddress,
			templateId: templates.generic || '',
			reference
		});
	} catch (err) {
		logger.error({ err }, 'Unable to send proof of evidence submission email to appellant');
	}
};

/**
 * @param { Rule6ProofOfEvidenceSubmission } rule6ProofEvidenceSubmission
 * @param {string} emailAddress
 * @param { ServiceUser } serviceUser
 */
const sendRule6ProofEvidenceSubmissionEmailToRule6PartyV2 = async (
	rule6ProofEvidenceSubmission,
	emailAddress,
	serviceUser
) => {
	try {
		const {
			siteAddressLine1,
			siteAddressLine2,
			siteAddressTown,
			siteAddressCounty,
			siteAddressPostcode,
			proofsOfEvidenceDueDate,
			applicationReference
		} = rule6ProofEvidenceSubmission.AppealCase;

		const caseReference = rule6ProofEvidenceSubmission.caseReference;

		const formattedAddress = formatSubmissionAddress({
			addressLine1: siteAddressLine1,
			addressLine2: siteAddressLine2,
			townCity: siteAddressTown,
			county: siteAddressCounty,
			postcode: siteAddressPostcode
		});

		const reference = rule6ProofEvidenceSubmission.id;

		let variables = {
			...config.services.notify.templateVariables,
			appealReferenceNumber: caseReference,
			siteAddress: formattedAddress,
			lpaReference: applicationReference || '',
			deadlineDate: proofsOfEvidenceDueDate
				? formatInTimeZone(proofsOfEvidenceDueDate, ukTimeZone, 'dd MMMM yyyy')
				: '',
			rule6RecipientLine: serviceUser?.organisation ? `To ${serviceUser.organisation},` : ''
		};

		logger.debug({ variables }, 'Sending proof of evidence email to rule 6 party');

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.representations.v2R6ProofsEvidence,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We've received your proof of evidence and witnesses - ${variables.appealReferenceNumber}`,
				content
			},
			destinationEmail: emailAddress,
			templateId: templates.generic || '',
			reference
		});
	} catch (err) {
		logger.error({ err }, 'Unable to send proof of evidence submission email to rule 6 party');
	}
};

/**
 * @param { Rule6StatementSubmission } rule6StatementSubmission
 * @param {string} emailAddress
 * @param {ServiceUser} serviceUser
 */
const sendRule6StatementSubmissionEmailToRule6PartyV2 = async (
	rule6StatementSubmission,
	emailAddress,
	serviceUser
) => {
	try {
		const {
			applicationReference,
			siteAddressLine1,
			siteAddressLine2,
			siteAddressTown,
			siteAddressCounty,
			siteAddressPostcode
		} = rule6StatementSubmission.AppealCase;

		const caseReference = rule6StatementSubmission.caseReference;

		const formattedAddress = formatSubmissionAddress({
			addressLine1: siteAddressLine1,
			addressLine2: siteAddressLine2,
			townCity: siteAddressTown,
			county: siteAddressCounty,
			postcode: siteAddressPostcode
		});

		const reference = rule6StatementSubmission.id;

		let variables = {
			...config.services.notify.templateVariables,
			appealReferenceNumber: caseReference,
			siteAddress: formattedAddress,
			lpaReference: applicationReference,
			rule6RecipientLine: serviceUser?.organisation ? `To ${serviceUser.organisation},` : ''
		};

		logger.debug({ variables }, 'Sending statement submission email to rule 6 party');

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.representations.v2Rule6StatementSubmission,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We have received your statement: ${variables.appealReferenceNumber}`,
				content
			},
			destinationEmail: emailAddress,
			templateId: templates.generic || '',
			reference
		});
	} catch (err) {
		logger.error({ err }, 'Unable to send statement submission email to rule 6 party');
	}
};

const sendFinalCommentSubmissionConfirmationEmail = async (finalComment) => {
	try {
		const lpa = await lpaService.getLpaById(finalComment.lpaCode);

		const recipientEmail = finalComment.email;
		let variables = {
			'local planning authority': lpa.getName(),
			name: finalComment.name
		};

		const reference = finalComment.horizonId;

		logger.debug(
			{ recipientEmail, variables, reference },
			'Sending final comments submission confirmation email'
		);

		await NotifyBuilder.reset()
			.setTemplateId(templates.FINAL_COMMENT.finalCommentSubmissionConfirmationEmail)
			.setDestinationEmailAddress(recipientEmail)
			.setTemplateVariablesFromObject(variables)
			.setReference(reference)
			.sendEmail(
				config.services.notify.baseUrl,
				config.services.notify.serviceId,
				config.services.notify.apiKey
			);
	} catch (err) {
		logger.error(
			{ err, appealId: finalComment.id },
			'Unable to send final comments submission confirmation email'
		);
	}
};

const sendSubmissionReceivedEmailToLpa = async (appeal) => {
	try {
		const lpa = await lpaService.getLpaById(appeal.lpaCode);
		const lpaEmail = lpa.getEmail();
		const appealType = caseTypeLookup(appeal.appealType, 'id');

		const getApplicationDecision = () => {
			if (
				appealType?.id.toString() === APPEAL_ID.HOUSEHOLDER ||
				appeal.eligibility.applicationDecision === constants.APPLICATION_DECISION.REFUSED
			)
				return 'the refusal of';
			if (appeal.eligibility.applicationDecision === constants.APPLICATION_DECISION.GRANTED)
				return 'conditions for the granted';
			if (
				appeal.eligibility.applicationDecision === constants.APPLICATION_DECISION.NODECISIONRECEIVED
			)
				return 'the non-determination of';
			logger.error(
				`unknown ApplicationDecision in v1 LPA notification email: ${appeal.eligibility.applicationDecision}`
			);
			return '';
		};

		const variables = {
			...config.services.notify.templateVariables,
			lpaName: lpa.getName(),
			appealType: appealType?.type.toLowerCase(),
			applicationDecision: getApplicationDecision(),
			lpaReference: appeal.planningApplicationNumber,
			appealReferenceNumber: appeal.horizonId ?? 'ID not provided',
			appealSiteAddress: _formatAddress(appeal.appealSiteSection.siteAddress),
			submissionDate: formatInTimeZone(appeal.submissionDate, ukTimeZone, 'dd MMMM yyyy')
		};

		const reference = appeal.id;

		logger.debug({ lpaEmail, variables, reference }, 'Sending email to LPA');

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.appealSubmission.v1LPANotification,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We've received a ${variables.appealType} appeal`,
				content
			},
			destinationEmail: lpaEmail,
			templateId: templates.generic,
			reference
		});
	} catch (err) {
		logger.error(
			{ err, lpaCode: appeal.lpaCode },
			'Unable to send submission received email to LPA'
		);
	}
};

const sendSaveAndReturnContinueWithAppealEmail = async (appeal) => {
	try {
		const { baseUrl } = config.apps.appeals;
		const deadlineDate = rules.appeal.deadlineDate(
			parseISO(appeal.decisionDate),
			appeal.appealType,
			appeal.eligibility.applicationDecision
		);

		const {
			recipientEmail,
			variables: configVars,
			reference
		} = appealTypeConfig[appeal.appealType].email.saveAndReturnContinueAppeal(
			appeal,
			baseUrl,
			deadlineDate
		);

		const variables = {
			...configVars,
			...config.services.notify.templateVariables
		};

		logger.debug({ recipientEmail, variables, reference }, 'Sending email to appellant');

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.appealSubmission.v1SaveAndReturnContinueAppeal,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `Continue with your appeal for ${variables.applicationNumber}`,
				content
			},
			destinationEmail: recipientEmail,
			templateId: templates.generic || '',
			reference
		});
	} catch (err) {
		logger.error(
			{ err, appealId: appeal.id },
			'Unable to send submission confirmation email to appellant'
		);
	}
};

const sendFailureToUploadToHorizonEmail = async (appealId) => {
	try {
		let variables = {
			id: appealId
		};
		const reference = `${appealId}-${new Date().toISOString}`;
		await NotifyBuilder.reset()
			.setTemplateId(templates.ERROR_MONITORING.failureToUploadToHorizon)
			.setDestinationEmailAddress(config.services.notify.emails.adminMonitoringEmail)
			.setTemplateVariablesFromObject(variables)
			.setReference(reference)
			.sendEmail(
				config.services.notify.baseUrl,
				config.services.notify.serviceId,
				config.services.notify.apiKey
			);
	} catch (err) {
		logger.error(
			{ err, appealId: appealId },
			'Unable to send "failure to upload to horizon email" to team'
		);
	}
};

const sendLPADashboardInviteEmail = async (user) => {
	try {
		const lpa = await lpaService.getLpaByCode(user.lpaCode);

		const recipientEmail = user.email;
		let variables = {
			'local planning authority': lpa.getName(),
			'lpa-link': `${config.apps.appeals.baseUrl}/manage-appeals/your-email-address`
		};

		const reference = user._id;

		logger.debug(
			{ recipientEmail, variables, reference },
			'Sending LPA dashboard invitation email'
		);

		await NotifyBuilder.reset()
			.setTemplateId(templates.LPA_DASHBOARD.lpaDashboardInviteEmail)
			.setDestinationEmailAddress(recipientEmail)
			.setTemplateVariablesFromObject(variables)
			.setReference(reference)
			.sendEmail(
				config.services.notify.baseUrl,
				config.services.notify.serviceId,
				config.services.notify.apiKey
			);
	} catch (err) {
		logger.error({ err, userId: user._id }, 'Unable to send LPA dashboard invitation email');
	}
};

/**
 * @param { InterestedPartySubmission } interestedPartySubmission
 */
const sendCommentSubmissionConfirmationEmailToIp = async (interestedPartySubmission) => {
	try {
		const { emailAddress, caseReference, firstName, lastName } = interestedPartySubmission;
		const reference = interestedPartySubmission.id;

		if (!emailAddress) {
			logger.warn(
				{ caseReference, interestedPartyId: reference },
				'Skipping comment submission confirmation email as email address is missing.'
			);
			return;
		}

		let variables = {
			...config.services.notify.templateVariables,
			name: `${firstName} ${lastName}`,
			appealReferenceNumber: caseReference
		};
		logger.debug({ variables }, 'Sending email to Interested Party');

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.representations.v2IpCommentSubmitted,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `We've received your comment: ${variables.appealReferenceNumber}`,
				content
			},
			destinationEmail: emailAddress,
			templateId: templates.generic || '',
			reference
		});
	} catch (err) {
		logger.error({ err }, 'Unable to send comment submission received email to IP');
	}
};

const _formatAddress = (addressJson) => {
	let address = addressJson.addressLine1;
	address += addressJson.addressLine2 && `\n${addressJson.addressLine2}`;
	address += addressJson.town && `\n${addressJson.town}`;
	address += addressJson.county && `\n${addressJson.county}`;
	address += `\n${addressJson.postcode}`;
	return address;
};

module.exports = {
	sendSubmissionReceivedEmailToLpa,
	sendSubmissionFollowUpEmailToAppellant,
	sendSubmissionConfirmationEmailToAppellant,

	sendSubmissionReceivedEmailToLpaV2,
	sendLpaStatementSubmissionReceivedEmailToLpaV2,
	sendLPAFinalCommentSubmissionEmailToLPAV2,
	sendLPAProofEvidenceSubmissionEmailToLPAV2,
	sendLPAHASQuestionnaireSubmittedEmailV2,
	sendAppellantFinalCommentSubmissionEmailToAppellantV2,
	sendAppellantProofEvidenceSubmissionEmailToAppellantV2,
	sendRule6ProofEvidenceSubmissionEmailToRule6PartyV2,
	sendRule6StatementSubmissionEmailToRule6PartyV2,

	sendSubmissionReceivedEmailToAppellantV2,
	sendSubmissionConfirmationEmailToAppellantV2,

	sendFinalCommentSubmissionConfirmationEmail,
	sendSaveAndReturnContinueWithAppealEmail,
	sendFailureToUploadToHorizonEmail,
	sendLPADashboardInviteEmail,
	sendCommentSubmissionConfirmationEmailToIp
};
