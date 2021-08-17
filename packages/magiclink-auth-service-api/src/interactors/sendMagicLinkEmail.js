const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const logger = require('../util/logger');
const uuid = require('uuid');
const config = require('../config');

module.exports = async (destinationEmailAddress, magicLinkURL) => {
  logger.debug('Start sending magic link email');
  return NotifyBuilder.reset()
    .setTemplateId(config.notify.templateId)
    .setDestinationEmailAddress(destinationEmailAddress)
    .setTemplateVariablesFromObject({
      magicLinkURL: magicLinkURL,
    })
    .setReference(uuid.v4())
    .sendEmail();
};
