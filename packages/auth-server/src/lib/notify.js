import NotifyBuilder from '@pins/common/src/lib/notify/notify-builder.js';
import config from '../configuration/config.js';
import logger from './logger.js';

/**
 * Sends an email to appellant confirming their registration and provides a link to continue
 * @param {string} recipientEmail
 * @param {string} userId
 */
export const sendConfirmRegistrationEmailToAppellant = async (recipientEmail, userId) => {
	const variables = {
		link: `${config.apps.appeals.baseUrl}/appeals/your-appeals`
	};

	logger.debug({ recipientEmail, variables }, 'Sending registration confirmation email');

	await NotifyBuilder.reset()
		.setTemplateId(
			config.services.notify.templates.APPELLANT_LOGIN.confirmRegistrationEmailToAppellant
		)
		.setDestinationEmailAddress(recipientEmail)
		.setTemplateVariablesFromObject(variables)
		.setReference(userId + 'registration')
		.sendEmail(
			config.services.notify.baseUrl,
			config.services.notify.serviceId,
			config.services.notify.apiKey
		);
};
