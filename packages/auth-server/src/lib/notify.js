import NotifyBuilder from '@pins/common/src/lib/notify/notify-builder.js';
import NotifyService from '@pins/common/src/lib/notify/notify-service.js';
import config from '../configuration/config.js';
import logger from './logger.js';
/** @type {NotifyService|null} */ // todo: use dependency injection instead
let notifyServiceInstance;
/** @returns {NotifyService} */
const getNotifyService = () => {
	if (notifyServiceInstance) {
		return notifyServiceInstance;
	}

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

/**
 * Sends an email to appellant confirming their registration and provides a link to continue
 * @param {string} recipientEmail
 * @param {string} userId
 */
export const sendConfirmRegistrationEmailToAppellant = async (recipientEmail, userId) => {
	try {
		const variables = {
			...config.services.notify.templateVariables,
			link: `${config.apps.appeals.baseUrl}/appeals/your-appeals`
		};

		const reference = userId + 'registration';
		logger.info({ recipientEmail }, 'Sending registration confirmation email');
		logger.debug({ recipientEmail, variables }, 'Sending registration confirmation email');

		const notifyService = getNotifyService();
		const content = notifyService.populateTemplate(
			NotifyService.templates.appealSubmission.v2registrationConfirmation,
			variables
		);
		await notifyService.sendEmail({
			personalisation: {
				subject: `Sign in to appeal a planning decision`,
				content
			},
			destinationEmail: recipientEmail,
			templateId: config.services.notify.templates.generic || '',
			reference
		});
	} catch (err) {
		logger.error({ err }, 'failed to send ConfirmRegistrationEmailToAppellant');
	}
};

/**
 * Sends an email to appellant confirming their registration and provides a link to continue
 * @param {string} recipientEmail
 * @param {string} code
 * @param {string} userId
 */
export const sendSecurityCodeEmail = async (recipientEmail, code, userId) => {
	try {
		const variables = {
			'unique code': code
		};

		logger.info({ recipientEmail }, 'Sending secure code email');
		logger.debug({ recipientEmail, variables, userId }, 'Sending secure code email');

		await NotifyBuilder.reset()
			.setTemplateId(config.services.notify.templates.SAVE_AND_RETURN.enterCodeIntoServiceEmail)
			.setDestinationEmailAddress(recipientEmail)
			.setTemplateVariablesFromObject(variables)
			.setReference(userId)
			.sendEmail(
				config.services.notify.baseUrl,
				config.services.notify.serviceId,
				config.services.notify.apiKey
			);
	} catch (err) {
		logger.error({ err }, 'failed to send SecurityCodeEmail');
	}
};
