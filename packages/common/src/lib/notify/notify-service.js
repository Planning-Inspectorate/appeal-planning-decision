const path = require('path');
const fs = require('fs');

/** @type {Record<string, string>} */
const templateCache = {};

class NotifyService {
	static templates = {
		appealSubmission: {
			v1Initial: '/appeal-submission/v1-submission-email.md',
			v1FollowUp: '/appeal-submission/v1-follow-up-email.md',
			v1LPANotification: '/appeal-submission/v1-lpa-notification.md',
			v2Initial: '/appeal-submission/v2-submission-email.md',
			v2FollowUp: '/appeal-submission/v2-follow-up-email.md',
			v2LPANotification: '/appeal-submission/v2-lpa-notification.md'
		},
		representations: {
			v2AppellantFinalComment: '/representations/v2-appellant-final-comments.md',
			v2LpaFinalComment: '/representations/v2-lpa-final-comments.md',
			v2ProofOfEvidenceSubmitted: '/representations/v2-proof-of-evidence-submitted.md'
		}
	};

	/** @type {import('notifications-node-client').NotifyClient} */
	#client;
	/** @type {import('pino').Logger} */
	#logger;

	#personalisationRegex = /\((\w+)\)/g;

	/**
	 * @param {Object} options
	 * @param {import('notifications-node-client').NotifyClient} options.notifyClient
	 * @param {import('pino').Logger} options.logger
	 */
	constructor({ notifyClient, logger }) {
		logger.info('creating new NotifyService');
		this.#client = notifyClient;
		this.#logger = logger;
	}

	/**
	 * Wrapper over notify.sendEmail
	 * @param {Object} options
	 * @param {string} options.destinationEmail
	 * @param {string} options.templateId
	 * @param {string} options.reference
	 * @param {import('notifications-node-client').Options['personalisation']} [options.personalisation]
	 * @param {string} [options.emailReplyToId]
	 * @see https://docs.notifications.service.gov.uk/node.html#send-an-email-method
	 * @returns {Promise<void>}
	 */
	async sendEmail({ destinationEmail, templateId, reference, personalisation, emailReplyToId }) {
		this.#logger.info(`Sending ${templateId} via notify ref ${reference}`);
		this.#logger.debug({
			destinationEmail,
			templateId,
			personalisation,
			emailReplyToId,
			reference
		});

		if (!templateId) {
			throw new Error('Template ID must be set before an email can be sent.');
		}

		if (!destinationEmail) {
			throw new Error('A destination email address must be set before an email can be sent.');
		}

		if (!reference) {
			throw new Error('A reference must be set before an email can be sent.');
		}

		try {
			await this.#client.sendEmail(templateId, destinationEmail, {
				personalisation,
				reference,
				emailReplyToId
			});
		} catch (err) {
			const message = 'Problem sending email';
			if (err.response) {
				this.#logger.error(
					{
						message: err.message,
						data: err.response.data,
						status: err.response.status,
						headers: err.response.headers
					},
					`${message} - response`
				);
			} else if (err.request) {
				this.#logger.error(
					{
						message: err.message,
						request: err.request
					},
					`${message} - request`
				);
			} else {
				this.#logger.error({ err }, message);
			}

			throw err;
		}
	}

	/**
	 * replaces personalisation in local template
	 * @param {string} templateName
	 * @param {Object<string, string>} personalisation
	 * @returns {string} populated template
	 */
	populateTemplate(templateName, personalisation) {
		const template = this.#getLocalTemplate(templateName);
		const content = Object.keys(personalisation).reduce((result, key) => {
			const value = personalisation[key];
			if (typeof value !== 'string' && typeof value !== 'number')
				throw new TypeError('value must be a string or number');
			return result.replaceAll(`((${key}))`, value);
		}, template);

		if (content.includes('((') && content.includes('))')) {
			const message =
				'missing personalisation parameters: ' + content.match(this.#personalisationRegex);
			throw new Error(
				`populateTemplate: personalisation parameters for ${templateName} ${message}`
			);
		}

		return content.trim();
	}

	/**
	 * Retrieves template, stores templates in a cache
	 * @param {string} templateName
	 * @returns {string} template content
	 */
	#getLocalTemplate(templateName) {
		if (!templateCache[templateName]) {
			const templatePath = path.join(__dirname, 'templates', `${templateName}`);
			try {
				templateCache[templateName] = fs.readFileSync(templatePath, { encoding: 'utf8' }).trim();
			} catch {
				throw new Error(`getLocalTemplate: missing template "${templateName}`);
			}
		}
		return templateCache[templateName];
	}
}

module.exports = NotifyService;
