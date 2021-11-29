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
module.exports = async (destinationEmailAddress, magicLinkURL, lpaName, applNo) => {
  logger.debug('Start sending magic link email');
  try {
    await NotifyBuilder.reset()
      .setTemplateId(config.notify.templateId)
      .setDestinationEmailAddress(destinationEmailAddress)
      .setTemplateVariablesFromObject({
        LPA: lpaName,
        'planning application number': applNo,
        'magic link': magicLinkURL,
      })
      .setReference(uuid.v4())
      .sendEmail();

    logger.debug('Magic link email was sent with success.');
  } catch (err) {
    logger.error({ err, lpaName, applNo }, 'Error occurred while trying to send magic link email.');
  }
};
