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
const enterCodeConfig = require('@pins/common/src/enter-code-config');
const lpaService = new LpaService();
const { templates } = config.services.notify;

const actionToTemplateMapping = [
	{
		action: enterCodeConfig.actions.lpaDashboard,
		template: templates.LPA_DASHBOARD.enterCodeIntoServiceEmailToLPA
	}
];

const mapActionToTemplate = (action) => {
	let [mapping] = actionToTemplateMapping.filter((a) => a.action === action);
	if (mapping && mapping.template) return mapping.template;
	return templates.SAVE_AND_RETURN.enterCodeIntoServiceEmailToAppellant;
};

const sendSubmissionConfirmationEmailToAppellant = async (appeal) => {
	try {
		const lpa = await lpaService.getLpaById(appeal.lpaCode);

		const recipientEmail = appeal.email;
		let variables = {
			name:
				appeal.appealType == '1001'
					? appeal.aboutYouSection.yourDetails.name
					: appeal.contactDetailsSection.contact.name,
			'appeal site address': _formatAddress(appeal.appealSiteSection.siteAddress),
			'local planning department': lpa.getName(),
			'link to pdf': `${config.apps.appeals.baseUrl}/document/${appeal.id}/${appeal.appealSubmission.appealPDFStatement.uploadedFile.id}`
		};

		const reference = appeal.id;

		logger.debug({ recipientEmail, variables, reference }, 'Sending email to appellant');

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

const sendSecurityCodeEmail = async (recipientEmail, code, identifier, action = '') => {
	try {
		const variables = {
			'unique code': code
		};

		logger.debug(
			{ recipientEmail, variables, identifier },
			'Sending secure code email to appellant'
		);
		await NotifyBuilder.reset()
			.setTemplateId(mapActionToTemplate(action))
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
	sendSubmissionConfirmationEmailToAppellant,
	sendFinalCommentSubmissionConfirmationEmail,
	sendSaveAndReturnContinueWithAppealEmail,
	sendSecurityCodeEmail,
	sendFailureToUploadToHorizonEmail,
	mapActionToTemplate
};
