const path = require('path');
const nunjucks = require('nunjucks');
const templatesDir = path.join(__dirname, 'templates');

class NotifyService {
	static templates = {
		appealSubmission: {
			v1SaveAndReturnContinueAppeal: 'appeal-submission/v1-save-and-return-continue-appeal.md',
			v1Initial: 'appeal-submission/v1-submission-email.md',
			v1FollowUp: 'appeal-submission/v1-follow-up-email.md',
			v1LPANotification: 'appeal-submission/v1-lpa-notification.md',
			v2Initial: 'appeal-submission/v2-submission-email.md',
			v2FollowUp: 'appeal-submission/v2-follow-up-email.md',
			v2LPANotification: 'appeal-submission/v2-lpa-notification.md',
			v2registrationConfirmation: 'appeal-submission/v2-registration-confirmation.md'
		},
		lpaq: {
			v2LPAQSubmitted: 'lpaq/v2-lpaq-submitted.md',
			v2LpaDashboardInvite: 'lpaq/v2-lpa-dashboard-invite-email.md'
		},
		representations: {
			v2LpaStatement: 'representations/v2-lpa-statement.md',
			v2AppellantFinalComment: 'representations/v2-appellant-final-comments.md',
			v2LpaFinalComment: 'representations/v2-lpa-final-comments.md',
			v2ProofOfEvidenceSubmitted: 'representations/v2-proof-of-evidence-submitted.md',
			v2IpCommentSubmitted: 'representations/v2-ip-comment-submitted.md',
			v2LpaProofsEvidence: 'representations/v2-lpa-proofs-evidence.md',
			v2R6ProofsEvidence: 'representations/v2-r6-proofs-evidence.md',
			v2Rule6StatementSubmission: 'representations/v2-rule6-statement-submission.md'
		},
		rule6: {
			partyCreated: 'rule-6/v2-rule-6-status-accepted-rule-6-party.md',
			partyAddedToMainParties: 'rule-6/v2-rule-6-status-accepted-main-parties.md',
			partyUpdated: 'rule-6/v2-rule-6-party-updated.md'
		}
	};

	/** @type {import('notifications-node-client').NotifyClient} */
	#client;
	/** @type {import('pino').Logger} */
	#logger;
	/** @type {import('nunjucks').Environment} */
	nunjucksEnv;

	/**
	 * @param {Object} options
	 * @param {import('notifications-node-client').NotifyClient} options.notifyClient
	 * @param {import('pino').Logger} options.logger
	 */
	constructor({ notifyClient, logger }) {
		logger.info('creating new NotifyService');
		this.#client = notifyClient;
		this.#logger = logger;
		this.nunjucksEnv = nunjucks.configure([templatesDir], {
			throwOnUndefined: true,
			autoescape: true
		});
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
	 * replaces personalisation in local template using nunjucks rendering engine
	 * @param {string} templateName
	 * @param {Object<string, string>} personalisation
	 * @returns {string} populated template
	 */
	populateTemplate(templateName, personalisation) {
		try {
			return this.nunjucksEnv.render(templateName, personalisation).trim();
		} catch (/** @type {any} */ e) {
			this.#logger.error({ error: e, template: templateName }, 'failed to render template');
			const message = e?.message || '';

			// notify error messages are in the form:
			// [template path] [Line X, Column Y]
			// error message
			const matches = message.match(/\[Line (\d+), Column (\d+)\]\s+(.*)/);
			if (matches) {
				const line = matches[1];
				const column = matches[2];
				const errorMessage = matches[3] || 'issue';
				if (message.includes('attempted to output null or undefined value')) {
					throw new Error(
						`populateTemplate error: missing parameter at line #${line} and column #${column} in template: ${templateName}`
					);
				}
				throw new Error(
					`populateTemplate error: '${errorMessage}' at line #${line} and column #${column} in template: ${templateName}`
				);
			} else if (message.includes('template not found')) {
				throw new Error(`populateTemplate error: template not found: ${templateName}`);
			}

			throw new Error(`populateTemplate error: ${message}`);
		}
	}
}

module.exports = NotifyService;
