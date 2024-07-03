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
const { parseISO } = require('date-fns');
const { format } = require('date-fns');
const constants = require('@pins/business-rules/src/constants');
const { formatSubmissionAddress } = require('@pins/common/src/lib/format-address');
const lpaService = new LpaService();
const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const { templates } = config.services.notify;

/**
 * @typedef {"HAS" | "S78"} AppealTypeCode
 * @typedef {import('appeals-service-api').Api.AppellantSubmission} AppellantSubmission
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
const sendSubmissionConfirmationEmailToAppellantV2 = async (appellantSubmission, email) => {
	try {
		const recipientEmail = email;
		const address = appellantSubmission.SubmissionAddress?.find(
			(address) => address.fieldName === 'siteAddress'
		);
		const formattedAddress = formatSubmissionAddress(address);

		let lpa;
		try {
			lpa = await lpaService.getLpaByCode(appellantSubmission.LPACode);
		} catch (err) {
			lpa = await lpaService.getLpaById(appellantSubmission.LPACode);
		}

		let variables = {
			appeal_reference_number: appellantSubmission.applicationReference,
			'appeal site address': formattedAddress,
			'local planning department': lpa.getName(),
			'link to pdf': `${config.apps.appeals.baseUrl}/document/${appellantSubmission.id}/${appellantSubmission.submissionPdfId}`
		};

		const reference = appellantSubmission.id;

		logger.debug(
			{ recipientEmail, variables, reference },
			'Sending submission confirmation email to appellant'
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
			{ err, appealId: appellantSubmission.id },
			'Unable to send submission confirmation email to appellant'
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

const sendSecurityCodeEmail = async (recipientEmail, code, identifier) => {
	try {
		const variables = {
			'unique code': code
		};

		logger.debug(
			{ recipientEmail, variables, identifier },
			'Sending secure code email to appellant'
		);
		await NotifyBuilder.reset()
			.setTemplateId(templates.SAVE_AND_RETURN.enterCodeIntoServiceEmailToAppellant)
			.setDestinationEmailAddress(recipientEmail)
			.setTemplateVariablesFromObject(variables)
			.setReference(identifier)
			.sendEmail(
				config.services.notify.baseUrl,
				config.services.notify.serviceId,
				config.services.notify.apiKey
			);
	} catch (err) {
		logger.error(
			{ err, appealId: identifier }, // TODO: change `appealId` to something more generic
			'Unable to send secure code email to appellant'
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
	sendSubmissionConfirmationEmailToAppellantV2,
	sendSubmissionReceivedEmailToLpaV2,
	sendFinalCommentSubmissionConfirmationEmail,
	sendSaveAndReturnContinueWithAppealEmail,
	sendSecurityCodeEmail,
	sendFailureToUploadToHorizonEmail,
	sendLPADashboardInviteEmail
};
