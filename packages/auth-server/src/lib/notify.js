import config from '../configuration/config.js';

class Notify {
	/**
	 * @param {{
	 *   notifyBuilder: import('@pins/common/src/lib/notify/notify-builder.js'),
	 *   notifyService : import('@pins/common/src/lib/notify/notify-service.js'),
	 *   v2registrationConfirmation : string,
	 *   logger: import('pino').Logger
	 * }} deps
	 */
	constructor({ notifyBuilder, notifyService, v2registrationConfirmation, logger }) {
		this.notifyService = notifyService;
		this.v2registrationConfirmation = v2registrationConfirmation;
		this.logger = logger;

		/** @deprecated */
		this.NotifyBuilder = notifyBuilder;
	}

	/**
	 * Sends an email to appellant confirming their registration and provides a link to continue
	 * @param {string} recipientEmail
	 * @param {string} userId
	 */
	async sendConfirmRegistrationEmailToAppellant(recipientEmail, userId) {
		try {
			const variables = {
				...config.services.notify.templateVariables,
				link: `${config.apps.appeals.baseUrl}/appeals/your-appeals`
			};

			this.logger.info({ recipientEmail }, 'Sending registration confirmation email');
			this.logger.debug({ recipientEmail, variables }, 'Sending registration confirmation email');

			const reference = userId + 'registration';

			const content = this.notifyService.populateTemplate(
				this.v2registrationConfirmation,
				variables
			);
			await this.notifyService.sendEmail({
				personalisation: {
					subject: `Sign in to appeal a planning decision: ${variables.link}`,
					content
				},
				destinationEmail: recipientEmail,
				templateId: config.services.notify.templates.generic || '',
				reference
			});
		} catch (err) {
			this.logger.error({ err }, 'failed to send ConfirmRegistrationEmailToAppellant');
		}
	}

	/**
	 * Sends an email to appellant confirming their registration and provides a link to continue
	 * @param {string} recipientEmail
	 * @param {string} code
	 * @param {string} userId
	 */
	async sendSecurityCodeEmail(recipientEmail, code, userId) {
		try {
			const variables = {
				'unique code': code
			};

			this.logger.info({ recipientEmail }, 'Sending secure code email');
			this.logger.debug({ recipientEmail, variables, userId }, 'Sending secure code email');

			await this.NotifyBuilder.reset()
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
			this.logger.error({ err }, 'failed to send SecurityCodeEmail');
		}
	}
}

export default Notify;
