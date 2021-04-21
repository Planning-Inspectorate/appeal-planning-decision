const logger = require('../logger');
const { createNotifyClient } = require('./notify-factory');

function NotifyBuilder() {
  function setPrivateNotifyClient(notifyClient) {
    logger.debug({ notifyClient }, 'Setting notify client');
    this.notifyClient = notifyClient;
  }

  /**
   * Intentionally do not expose the notify client directly.
   *
   * @returns {*}
   */
  function getNotifyClient() {
    if (!this.notifyClient) {
      logger.info('Notify client was not set. Creating...');
      setPrivateNotifyClient(createNotifyClient());
    }

    return this.notifyClient;
  }

  return {
    /**
     * Allow overriding the default / fallback client with custom settings. This is optional.
     *
     * @param notifyClient
     * @returns {*}
     */
    setNotifyClient(notifyClient) {
      setPrivateNotifyClient(notifyClient);

      return this;
    },

    /**
     * @see https://docs.notifications.service.gov.uk/node.html#send-an-email-arguments-templateid-required
     * @param templateId
     * @returns {*}
     */
    setTemplateId(templateId) {
      logger.debug({ templateId }, 'Setting template ID');
      this.templateId = templateId;

      return this;
    },

    /**
     * @see https://docs.notifications.service.gov.uk/node.html#send-an-email-arguments-personalisation-required
     * @param key
     * @param value
     * @param redact
     * @returns {*}
     */
    setTemplateVariable(key, value, redact = true) {
      logger.debug(
        { key, value: redact ? 'redacted' : value },
        'Setting template personalisation variable.'
      );

      this.templatePersonalisation = {
        ...(this.templatePersonalisation || {}),
        [key]: value,
      };

      return this;
    },

    /**
     * All values will be redacted. Use `setTemplateVariable` to explicitly override if needed.
     *
     * @param templateVariableObject Object({key: string|number|bool })
     * @returns {*}
     */
    setTemplateVariablesFromObject(templateVariableObject) {
      logger.debug('Setting template variables from object.');
      Object.entries(templateVariableObject).forEach(([key, value]) =>
        this.setTemplateVariable(key, value)
      );

      return this;
    },

    /**
     * @see https://docs.notifications.service.gov.uk/node.html#upload-your-file
     * @param key string
     * @param file File|Buffer
     * @returns {*}
     */
    addFileToTemplateVariables(key, file) {
      logger.debug({ key }, 'Adding file...');
      this.setTemplateVariable(key, getNotifyClient().prepareUpload(file));

      return this;
    },

    /**
     * @see https://docs.notifications.service.gov.uk/node.html#emailaddress-required
     * @param destinationEmail
     * @returns {*}
     */
    setDestinationEmailAddress(destinationEmail) {
      logger.debug({ destinationEmail }, 'Setting destination email address');
      this.destinationEmail = destinationEmail;

      return this;
    },

    /**
     * @see https://docs.notifications.service.gov.uk/node.html#send-an-email-arguments-reference-required
     * @param reference
     */
    setReference(reference) {
      logger.debug({ reference }, 'Setting reference');
      this.reference = reference;

      return this;
    },

    /**
     * Wrapper over notify.sendEmail
     *
     * @see https://docs.notifications.service.gov.uk/node.html#send-an-email-method
     * @returns {Promise<void>}
     */
    async sendEmail() {
      logger.info(`Sending email via notify`);

      logger.debug({
        notifyClient: getNotifyClient(),
        templateId: this.templateId,
        destinationEmail: this.destinationEmail,
        templatePersonalisation: `Has ${
          Object.keys(this.templatePersonalisation || {}).length
        } value(s) set.`,
      });

      if (!this.templateId) {
        throw new Error('Template ID must be set before an email can be sent.');
      }

      if (!this.destinationEmail) {
        throw new Error('A destination email address must be set before an email can be sent.');
      }

      if (!this.reference) {
        throw new Error('A reference must be set before an email can be sent.');
      }

      try {
        await getNotifyClient().sendEmail(this.templateId, this.destinationEmail, {
          personalisation: this.templatePersonalisation,
          reference: this.reference,
        });
      } catch (err) {
        const message = 'Problem sending email';
        if (err.response) {
          logger.error(
            {
              message: err.message,
              data: err.response.data,
              status: err.response.status,
              headers: err.response.headers,
            },
            `${message} - response`
          );
        } else if (err.request) {
          logger.error(
            {
              message: err.message,
              request: err.request,
            },
            `${message} - request`
          );
        } else {
          logger.error({ err }, message);
        }
      }
    },
  };
}

module.exports = NotifyBuilder;
