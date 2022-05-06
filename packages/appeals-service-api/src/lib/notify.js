const {
  config: {
    appeal: { type: appealTypeConfig },
  },
} = require('@pins/business-rules');
const { NotifyClient } = require('notifications-node-client');
const config = require('./config');
const logger = require('./logger');
const { getLpa } = require('../services/lpa.service');

const { templates } = config.services.notify;

const personalisation = (templateVariableObject) => {
  let templatePersonalisation;
  Object.entries(templateVariableObject).forEach(([key, value]) => {
    templatePersonalisation = {
      ...(templatePersonalisation || {}),
      [key]: value,
    };
  });
  return templatePersonalisation;
};

const sendSubmissionConfirmationEmailToAppellant = async (appeal) => {
  try {
    const lpa = await getLpa(appeal.lpaCode);
    const { recipientEmail, variables, reference } = appealTypeConfig[
      appeal.appealType
    ].email.appellant(appeal, lpa);

    logger.debug({ recipientEmail, variables, reference }, 'Sending email to appellant');

    const personalisationTemplate = personalisation(variables);
    const notifyClient = new NotifyClient(config.services.notify.apiKey);
    notifyClient
      .sendEmail(
        templates[appeal.appealType].appealSubmissionConfirmationEmailToAppellant,
        recipientEmail,
        {
          personalisationTemplate,
          reference,
        }
      )
      .then((response) => logger.log(response))
      .catch((err) => logger.error(err));
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

    const personalisationTemplate = personalisation(variables);
    const notifyClient = new NotifyClient(config.services.notify.apiKey);
    notifyClient
      .sendEmail(templates[appeal.appealType].appealNotificationEmailToLpa, recipientEmail, {
        personalisationTemplate,
        reference,
      })
      .then((response) => logger.log(response))
      .catch((err) => logger.error(err));
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
