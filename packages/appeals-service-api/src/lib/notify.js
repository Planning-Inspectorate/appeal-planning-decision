const {
	config: {
		appeal: { type: appealTypeConfig }
	},
	rules
} = require('@pins/business-rules');
const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const config = require('../configuration/config');
const logger = require('./logger');
const { getLpaById } = require('../services/lpa.service');
const { parseISO } = require('date-fns');

const { templates } = config.services.notify;

const sendSubmissionConfirmationEmailToAppellant = async (appeal) => {
	try {
		const lpa = await getLpaById(appeal.lpaCode);
		const { recipientEmail, variables, reference } = appealTypeConfig[
			appeal.appealType
		].email.appellant(appeal, lpa);

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

const sendSubmissionReceivedEmailToLpa = async (appeal) => {
	try {
		const lpa = await getLpaById(appeal.lpaCode);
		const { recipientEmail, variables, reference } = appealTypeConfig[appeal.appealType].email.lpa(
			appeal,
			lpa
		);

		logger.debug({ recipientEmail, variables, reference }, 'Sending email to LPA');

		await NotifyBuilder.reset()
			.setTemplateId(templates[appeal.appealType].appealNotificationEmailToLpa)
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

const sendSaveAndReturnEnterCodeIntoServiceEmail = async (recipientEmail, code, identifier) => {
	try {
		const variables = {
			'unique code': code
		}

		logger.debug({ recipientEmail, variables, identifier }, 'Sending secure code email to appellant');

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

const sendConfirmEmailAddressEmail = async (appeal) => {
	try {
		const { baseUrl } = config.apps.appeals;
		const { recipientEmail, variables, reference } = appealTypeConfig[
			appeal.appealType
		].email.confirmEmail(appeal, baseUrl);
		logger.debug({ recipientEmail, variables, reference }, 'Sending email to appellant');

		await NotifyBuilder.reset()
			.setTemplateId(templates.CONFIRM_EMAIL.confirmEmail)
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
			'Unable to send confirm email address confirmation email to appellant'
		);
	}
};

const createToken = () => {
	const token = [];
	for (let i = 0; i < 5; i += 1) {
		const num = Math.floor(Math.random() * 9 + 1);
		token.push(num);
	}
	return token.join('');
};

module.exports = {
	sendSubmissionReceivedEmailToLpa,
	sendSubmissionConfirmationEmailToAppellant,
	sendSaveAndReturnContinueWithAppealEmail,
	sendSaveAndReturnEnterCodeIntoServiceEmail,
	sendConfirmEmailAddressEmail,
	createToken
};
