const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const uuid = require('uuid');
const logger = require('../util/logger');
const config = require('../config');

/**
 * Sends an email to a given email address using the Notify service.
 *
 * @param destinationEmailAddress email address.
 * @param magicLinkURL variable used inside the email template.
 * @returns {Promise<void|any>}
 */
module.exports = async (destinationEmailAddress, magicLinkURL) => {
  logger.debug('Start sending magic link email');
  return NotifyBuilder.reset()
    .setTemplateId(config.notify.templateId)
    .setDestinationEmailAddress(destinationEmailAddress)
    .setTemplateVariablesFromObject({
      magicLinkURL,
    })
    .setReference(uuid.v4())
    .sendEmail()
    .then(() => {
      logger.debug('Magic link email was sent with success.');
    })
    .catch((err) => {
      logger.error({ err }, 'Error occurred while trying to send magic link email.');
    });
};
