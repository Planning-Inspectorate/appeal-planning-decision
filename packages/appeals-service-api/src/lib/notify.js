const {
	config: {
		appeal: { type: appealTypeConfig }
	}
} = require('@pins/business-rules');
const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const config = require('./config');
const logger = require('./logger');
const { getLpa } = require('../services/lpa.service');

const { templates } = config.services.notify;

const sendSubmissionConfirmationEmailToAppellant = async (appeal) => {
	try {
		const lpa = await getLpa(appeal.lpaCode);
		const { recipientEmail, variables, reference } = appealTypeConfig[
			appeal.appealType
		].email.appellant(appeal, lpa);

		logger.debug({ recipientEmail, variables, reference }, 'Sending email to appellant');

		await NotifyBuilder.reset()
			.setTemplateId(templates[appeal.appealType].appealSubmissionConfirmationEmailToAppellant)
			.setDestinationEmailAddress(recipientEmail)
			.setTemplateVariablesFromObject(variables)
			.setReference(reference)
			.sendEmail();
	} catch (err) {
		logger.error(
			{ err, appealId: appeal.id },
			'Unable to send submission confirmation email to appellant'
		);
	}
};

const sendSubmissionReceivedEmailToLpa = async (appeal) => {
	try {
		const lpa = await getLpa(appeal.lpaCode);
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
			.sendEmail();
	} catch (err) {
		logger.error(
			{ err, lpaCode: appeal.lpaCode },
			'Unable to send submission received email to LPA'
		);
	}
};

const sendSaveAndReturnContinueWithAppealEmail = async (appeal, token) => {
	try {
		const { baseUrl } = config.apps.appeals;
		const link = `${baseUrl}/full-appeal/submit-appeal/enter-code/${token}`;
		const { recipientEmail, variables, reference } = appealTypeConfig[
			appeal.appealType
		].email.saveAndReturnContinueAppeal(appeal, link);

		logger.debug({ recipientEmail, variables, reference }, 'Sending email to appellant');

		await NotifyBuilder.reset()
			.setTemplateId(templates.SAVE_AND_RETURN.continueWithAppealEmailToAppellant)
			.setDestinationEmailAddress(recipientEmail)
			.setTemplateVariablesFromObject(variables)
			.setReference(reference)
			.sendEmail();
	} catch (err) {
		logger.error(
			{ err, appealId: appeal.id },
			'Unable to send submission confirmation email to appellant'
		);
	}
};

const sendSaveAndReturnEnterCodeIntoServiceEmail = async (saved, token) => {
	const { appeal } = saved;
	try {
		const { recipientEmail, variables, reference } = appealTypeConfig[
			appeal.appealType
		].email.saveAndReturnEnterCodeIntoService(appeal, token);

		logger.debug({ recipientEmail, variables, reference }, 'Sending email to appellant');

		await NotifyBuilder.reset()
			.setTemplateId(templates.SAVE_AND_RETURN.enterCodeIntoServiceEmailToAppellant)
			.setDestinationEmailAddress(recipientEmail)
			.setTemplateVariablesFromObject(variables)
			.setReference(reference)
			.sendEmail();
	} catch (err) {
		logger.error(
			{ err, appealId: appeal.id },
			'Unable to send submission confirmation email to appellant'
		);
	}
};

const sendConfirmEmailAddressEmail = async (appeal, token) => {
	try {
		const { baseUrl } = config.apps.appeals;
		const link = `${baseUrl}/email-address-confirmed/${token}`;
		const { recipientEmail, variables, reference } = appealTypeConfig[
			appeal.appealType
		].email.confirmEmail(appeal, link);
		logger.debug({ recipientEmail, variables, reference }, 'Sending email to appellant');

		await NotifyBuilder.reset()
			.setTemplateId(templates.CONFIRM_EMAIL.confirmEmail)
			.setDestinationEmailAddress(recipientEmail)
			.setTemplateVariablesFromObject(variables)
			.setReference(reference)
			.sendEmail();
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
