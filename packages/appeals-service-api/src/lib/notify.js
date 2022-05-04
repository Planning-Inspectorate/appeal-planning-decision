const {
  config: {
    appeal: { type: appealTypeConfig },
  },
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
      .sendEmailClient();
  } catch (err) {
    logger.error(
      { err, lpaCode: appeal.lpaCode },
      'Unable to send submission received email to LPA'
    );
  }
};

module.exports = {
  sendSubmissionReceivedEmailToLpa,
  sendSubmissionConfirmationEmailToAppellant,
};
