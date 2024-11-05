const {
	config: {
		appeal: { type: appealTypeConfig }
	},
	rules
} = require('@pins/business-rules');
const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const config = require('../configuration/config');
const logger = require('./logger');
const LpaService = require('../services/lpa.service');
const { format, parseISO } = require('date-fns');
const { formatInTimeZone } = require('date-fns-tz');
const constants = require('@pins/business-rules/src/constants');
const { formatSubmissionAddress } = require('@pins/common/src/lib/format-address');
const lpaService = new LpaService();
const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const { templates } = config.services.notify;

/**
 * @typedef {"HAS" | "S78"} AppealTypeCode
 * @typedef {import('@prisma/client').AppealCase } AppealCase
 * @typedef {import('appeals-service-api').Api.AppellantSubmission} AppellantSubmission
 * @typedef {import('@prisma/client').InterestedPartySubmission} InterestedPartySubmission
 * @typedef {import('appeals-service-api').Api.LPAStatementSubmission} LPAStatementSubmission
 * @typedef {import('appeals-service-api').Api.LPAFinalCommentSubmission} LPAFinalCommentSubmission
 * @typedef {import('appeals-service-api').Api.AppellantFinalCommentSubmission} AppellantFinalCommentSubmission
 * @typedef {import('appeals-service-api').Api.AppellantProofOfEvidenceSubmission} AppellantProofOfEvidenceSubmission
 */

/** @type {Record<AppealTypeCode, string>} */
const appealTypeCodeToAppealId = {
	HAS: APPEAL_ID.HOUSEHOLDER,
	S78: APPEAL_ID.PLANNING_SECTION_78
};

/** @type {Record<AppealTypeCode, string>} */
const appealTypeCodeToAppealText = {
	HAS: 'householder planning',
	S78: 'full planning'
};

const sendSubmissionConfirmationEmailToAppellant = async (appeal) => {
	try {
		const recipientEmail = appeal.email;
		let variables = {
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

		await NotifyBuilder.reset()
			.setTemplateId(templates[appeal.appealType].appealSubmissionConfirmationEmailToAppellant)
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
			{ err, appealId: appeal.id },
			'Unable to send submission confirmation email to appellant'
		);
	}
};

/**
 * @param { AppellantSubmission } appellantSubmission
 * @param { string } email
 */
const sendSubmissionReceivedEmailToAppellantV2 = async (appellantSubmission, email) => {
	try {
		const recipientEmail = email;

		const variables = {
			name: `${appellantSubmission.contactFirstName} + ${appellantSubmission.contactLastName}`
		};

		const reference = appellantSubmission.id;

		logger.debug(
			{ recipientEmail, variables, reference },
			'Sending submission received email to appellant'
		);

		await NotifyBuilder.reset()
			.setTemplateId(templates.V2_COMMON.appealSubmissionReceivedEmailToAppellant)
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
			{ err, appealId: appellantSubmission.id },
			'Unable to send submission received email v2 to appellant'
		);
	}
};

/**
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

		let lpa;
		try {
			lpa = await lpaService.getLpaByCode(appealCase.LPACode);
		} catch (err) {
			lpa = await lpaService.getLpaById(appealCase.LPACode);
		}

		const variables = {
			appeal_reference_number: appealCase.caseReference,
			'appeal site address': formattedAddress,
			'local planning department': lpa.getName(),
			'link to pdf': `${config.apps.appeals.baseUrl}/appeal-document/${appellantSubmission.id}`
		};

		const reference = appealCase.id;

		logger.debug(
			{ recipientEmail, variables, reference },
			'Sending submission confirmation email to appellant v2'
		);

		await NotifyBuilder.reset()
			.setTemplateId(
				templates[appealTypeCodeToAppealId[appellantSubmission.appealTypeCode]]
					.appealSubmissionConfirmationEmailToAppellantV2
			)
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
			{ err, appealId: appealCase.id },
			'Unable to send submission confirmation email to appellant v2'
		);
	}
};

/**
 * @param { AppellantSubmission } appellantSubmission
 * @param { string } email
 */
const sendSubmissionReceivedEmailToLpaV2 = async (appellantSubmission, email) => {
	try {
		let lpa;
		try {
			lpa = await lpaService.getLpaByCode(appellantSubmission.LPACode);
		} catch (err) {
			lpa = await lpaService.getLpaById(appellantSubmission.LPACode);
		}
		const lpaEmail = lpa.getEmail();

		const reference = appellantSubmission.id;
		// TODO: put inside an appeal model
		let variables = {
			lpa_reference: appellantSubmission.applicationReference,
			appellant_email_address: email,
			'appeal type': appealTypeCodeToAppealText[appellantSubmission.appealTypeCode]
		};

		logger.debug({ lpaEmail, variables, reference }, 'Sending email to LPA');

		await NotifyBuilder.reset()
			.setTemplateId(
				templates[appealTypeCodeToAppealId[appellantSubmission.appealTypeCode]]
					.appealNotificationEmailToLpaV2
			)
			.setDestinationEmailAddress(lpaEmail)
			.setTemplateVariablesFromObject(variables)
			.setReference(reference)
			.sendEmail(
				config.services.notify.baseUrl,
				config.services.notify.serviceId,
				config.services.notify.apiKey
			);
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
		appealTypeCode,
		siteAddressLine1,
		siteAddressLine2,
		siteAddressTown,
		siteAddressCounty,
		siteAddressPostcode
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

		const lpaName = lpa.getName();

		const reference = lpaStatementSubmission.id;
		// TODO: put inside an appeal model
		let variables = {
			LPA: lpaName,
			appeal_reference_number: caseReference,
			'appeal site address': formattedAddress,
			'deadline date': format(finalCommentsDueDate, 'dd MMMM yyyy')
		};

		logger.debug({ lpaEmail, variables, reference }, 'Sending email to LPA');

		await NotifyBuilder.reset()
			.setTemplateId(
				templates[appealTypeCodeToAppealId[appealTypeCode]]
					.lpaStatementSubmissionConfirmationEmailToLpaV2
			)
			.setDestinationEmailAddress(lpaEmail)
			.setTemplateVariablesFromObject(variables)
			.setReference(reference)
			.sendEmail(
				config.services.notify.baseUrl,
				config.services.notify.serviceId,
				config.services.notify.apiKey
			);
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
		appealTypeCode,
		siteAddressLine1,
		siteAddressLine2,
		siteAddressTown,
		siteAddressCounty,
		siteAddressPostcode
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
			LPA: lpaName,
			appeal_reference_number: caseReference,
			'appeal site address': formattedAddress,
			'deadline date': format(finalCommentsDueDate, 'dd MMMM yyyy')
		};

		logger.debug({ lpaEmail, variables, reference }, 'Sending email to LPA');

		await NotifyBuilder.reset()
			.setTemplateId(
				templates[appealTypeCodeToAppealId[appealTypeCode]]
					.lpaFinalCommentsSubmissionConfirmationEmailToLpaV2
			)
			.setDestinationEmailAddress(lpaEmail)
			.setTemplateVariablesFromObject(variables)
			.setReference(reference)
			.sendEmail(
				config.services.notify.baseUrl,
				config.services.notify.serviceId,
				config.services.notify.apiKey
			);
	} catch (err) {
		logger.error({ err, lpaCode: lpaCode }, 'Unable to send final comment submission email to LPA');
	}
};

/**
 * @param { AppellantFinalCommentSubmission } appellantFinalCommentSubmission
 * @param {string} emailAddress
 * @param {string} appellantName
 */
const sendAppellantFinalCommentSubmissionEmailToAppellantV2 = async (
	appellantFinalCommentSubmission,
	emailAddress,
	appellantName
) => {
	try {
		const {
			appealTypeCode,
			siteAddressLine1,
			siteAddressLine2,
			siteAddressTown,
			siteAddressCounty,
			siteAddressPostcode,
			finalCommentsDueDate
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
			appeal_reference_number: caseReference,
			'appellant name': appellantName,
			'appeal site address': formattedAddress,
			'deadline date': format(finalCommentsDueDate, 'dd MMMM yyyy')
		};

		logger.debug({ variables }, 'Sending final comment email to appellant');

		await NotifyBuilder.reset()
			.setTemplateId(
				templates[appealTypeCodeToAppealId[appealTypeCode]]
					.appellantFinalCommentsSubmissionConfirmationEmailToAppellantV2
			)
			.setDestinationEmailAddress(emailAddress)
			.setTemplateVariablesFromObject(variables)
			.setReference(reference)
			.sendEmail(
				config.services.notify.baseUrl,
				config.services.notify.serviceId,
				config.services.notify.apiKey
			);
	} catch (err) {
		logger.error({ err }, 'Unable to send final comment submission email to appellant');
	}
};

/**
 * @param { AppellantProofOfEvidenceSubmission } appellantProofEvidenceSubmission
 * @param {string} emailAddress
 * @param {string} appellantName
 */
const sendAppellantProofEvidenceSubmissionEmailToAppellantV2 = async (
	appellantProofEvidenceSubmission,
	emailAddress,
	appellantName
) => {
	try {
		const {
			appealTypeCode,
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
			appeal_reference_number: caseReference,
			'appellant name': appellantName,
			site_address: formattedAddress,
			lpa_reference: applicationReference,
			'deadline date': formatInTimeZone(proofsOfEvidenceDueDate, 'Europe/London', 'dd MMMM yyyy')
		};

		logger.debug({ variables }, 'Sending proof of evidence email to appellant');

		await NotifyBuilder.reset()
			.setTemplateId(
				templates[appealTypeCodeToAppealId[appealTypeCode]]
					.appellantProofEvidenceSubmissionConfirmationEmailToAppellantV2
			)
			.setDestinationEmailAddress(emailAddress)
			.setTemplateVariablesFromObject(variables)
			.setReference(reference)
			.sendEmail(
				config.services.notify.baseUrl,
				config.services.notify.serviceId,
				config.services.notify.apiKey
			);
	} catch (err) {
		logger.error({ err }, 'Unable to send proof of evidence submission email to appellant');
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

		const appealRef = appeal.horizonId ?? 'ID not provided';
		// TODO: put inside an appeal model
		let variables = {
			'planning application number': appeal.planningApplicationNumber,
			'site address': _formatAddress(appeal.appealSiteSection.siteAddress),
			'appeal reference': appealRef
		};

		if (appeal.appealType == '1001') {
			(variables.LPA = lpa.getName()),
				(variables.date = format(appeal.submissionDate, 'dd MMMM yyyy'));
		} else if (appeal.appealType == '1005') {
			(variables['loca planning department'] = lpa.getName()),
				(variables['submission date'] = format(appeal.submissionDate, 'dd MMMM yyyy')),
				(variables.refused = _getYesOrNoForBoolean(
					appeal.eligibility.applicationDecision === constants.APPLICATION_DECISION.REFUSED
				)),
				(variables.granted = _getYesOrNoForBoolean(
					appeal.eligibility.applicationDecision === constants.APPLICATION_DECISION.GRANTED
				)),
				(variables['non-determination'] = _getYesOrNoForBoolean(
					appeal.eligibility.applicationDecision ===
						constants.APPLICATION_DECISION.NODECISIONRECEIVED
				));
		}

		const reference = appeal.id;

		logger.debug({ lpaEmail, variables, reference }, 'Sending email to LPA');

		await NotifyBuilder.reset()
			.setTemplateId(templates[appeal.appealType].appealNotificationEmailToLpa)
			.setDestinationEmailAddress(lpaEmail)
			.setTemplateVariablesFromObject(variables)
			.setReference(reference)
			.sendEmail(
				config.services.notify.baseUrl,
				config.services.notify.serviceId,
				config.services.notify.apiKey
			);
	} catch (err) {
		logger.error(
			{ err, lpaCode: appeal.lpaCode },
			'Unable to send submission received email to LPA'
		);
	}
};

const sendSubmissionReceivedEmailToAppellant = async (appeal) => {
	try {
		const lpa = await lpaService.getLpaById(appeal.lpaCode);
		const appealRef = appeal.horizonIdFull ?? 'ID not provided';

		const recipientEmail = appeal.email;
		let variables = {
			name:
				appeal.appealType == '1001'
					? appeal.aboutYouSection.yourDetails.name
					: appeal.contactDetailsSection.contact.name,
			'appeal reference number': appealRef,
			'appeal site address': _formatAddress(appeal.appealSiteSection.siteAddress),
			'local planning department': lpa.getName(),
			'link to pdf': `${config.apps.appeals.baseUrl}/document/${appeal.id}/${appeal.appealSubmission.appealPDFStatement.uploadedFile.id}`
		};

		const reference = appeal.id;

		logger.debug(
			{ recipientEmail, variables, reference },
			'Sending submission received email to appellant'
		);

		await NotifyBuilder.reset()
			.setTemplateId(templates[appeal.appealType].appealSubmissionReceivedEmailToAppellant)
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
			{ err, appealId: appeal.id },
			'Unable to send submission received email to appellant'
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

		const { recipientEmail, variables, reference } = appealTypeConfig[
			appeal.appealType
		].email.saveAndReturnContinueAppeal(appeal, baseUrl, deadlineDate);
		logger.debug({ recipientEmail, variables, reference }, 'Sending email to appellant');
		await NotifyBuilder.reset()
			.setTemplateId(templates.SAVE_AND_RETURN.continueWithAppealEmailToAppellant)
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

		let variables = {
			name: `${firstName} ${lastName}`,
			'appeal reference': caseReference
		};

		logger.debug({ variables }, 'Sending email to Interested Party');

		await NotifyBuilder.reset()
			.setTemplateId(templates.INTERESTED_PARTIES.ipCommentSubmissionConfirmationEmail)
			.setDestinationEmailAddress(emailAddress)
			.setTemplateVariablesFromObject(variables)
			.setReference(caseReference)
			.sendEmail(
				config.services.notify.baseUrl,
				config.services.notify.serviceId,
				config.services.notify.apiKey
			);
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

const _getYesOrNoForBoolean = (booleanToUse) => {
	return booleanToUse ? 'yes' : 'no';
};

module.exports = {
	sendSubmissionReceivedEmailToLpa,
	sendSubmissionReceivedEmailToAppellant,
	sendSubmissionConfirmationEmailToAppellant,

	sendSubmissionReceivedEmailToLpaV2,
	sendLpaStatementSubmissionReceivedEmailToLpaV2,
	sendLPAFinalCommentSubmissionEmailToLPAV2,
	sendAppellantFinalCommentSubmissionEmailToAppellantV2,
	sendAppellantProofEvidenceSubmissionEmailToAppellantV2,

	sendSubmissionReceivedEmailToAppellantV2,
	sendSubmissionConfirmationEmailToAppellantV2,

	sendFinalCommentSubmissionConfirmationEmail,
	sendSaveAndReturnContinueWithAppealEmail,
	sendFailureToUploadToHorizonEmail,
	sendLPADashboardInviteEmail,
	sendCommentSubmissionConfirmationEmailToIp
};
