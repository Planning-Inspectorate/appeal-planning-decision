const { format } = require('date-fns');
const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const config = require('../config');
const logger = require('../logger');
const { getAddressMultiLine } = require('../get-address');
const { getLpa } = require('../../services/lpa.service');
const { isValidAppealForSubmissionReceivedNotificationEmail } = require('../notify-validation');
const { FULL_APPEAL } = require('../../constants');

async function sendAppealSubmissionConfirmationEmailToAppellant(appeal) {
  if (!isValidAppealForSubmissionReceivedNotificationEmail(appeal)) {
    throw new Error('Appeal was not available.');
  }

  try {
    const lpa = await getLpa(appeal.lpaCode);

    await NotifyBuilder.reset()
      .setTemplateId(
        config.services.notify.templates.fullAppeal.appealSubmissionConfirmationEmailToAppellant
      )
      .setDestinationEmailAddress(appeal.aboutYouSection.yourDetails.email)
      .setTemplateVariablesFromObject({
        name: appeal.aboutYouSection.yourDetails.name,
        'appeal site address': getAddressMultiLine(appeal.appealSiteSection.siteAddress),
        'local planning department': lpa.name,
        'link to pdf': `${config.apps.appeals.baseUrl}/document/${appeal.id}/${appeal.appealSubmission.appealPDFStatement.uploadedFile.id}`,
      })
      .setReference(appeal.id)
      .sendEmail();
  } catch (e) {
    logger.error(
      { err: e, appeal },
      'Unable to send appeal submission confirmation email to appellant.'
    );
  }
}

async function sendAppealSubmissionReceivedNotificationEmailToLpa(appeal) {
  if (!isValidAppealForSubmissionReceivedNotificationEmail(appeal)) {
    throw new Error('Appeal was not available.');
  }

  let lpa = {};
  try {
    lpa = await getLpa(appeal.lpaCode);
  } catch (e) {
    logger.error({ err: e, lpaCode: appeal.lpaCode }, 'Unable to find LPA from given lpaCode');
  }

  if (!lpa || !lpa.name) {
    lpa = {
      name: appeal.lpaCode,
    };
  }

  try {
    if (!lpa.email) {
      throw new Error('Missing LPA email. This indicates an issue with the look up data.');
    }

    const { applicationDecision } = appeal.eligibility;

    await NotifyBuilder.reset()
      .setTemplateId(config.services.notify.templates.fullAppeal.appealNotificationEmailToLpa)
      .setDestinationEmailAddress(lpa.email)
      .setTemplateVariablesFromObject({
        'loca planning department': lpa.name, // todo: template i kontrol et
        'submission date': format(appeal.submissionDate, 'dd MMMM yyyy'),
        'planning application number': appeal.requiredDocumentsSection.applicationNumber,
        'site address': getAddressMultiLine(appeal.appealSiteSection.siteAddress),
        refused:
          applicationDecision === FULL_APPEAL.PLANNING_APPLICATION_STATUS.REFUSED ? 'yes' : 'no',
        granted:
          applicationDecision === FULL_APPEAL.PLANNING_APPLICATION_STATUS.GRANTED ? 'yes' : 'no',
        'non-determination':
          applicationDecision === FULL_APPEAL.PLANNING_APPLICATION_STATUS.NODECISION ? 'yes' : 'no',
      })
      .setReference(appeal.id)
      .sendEmail();
  } catch (e) {
    logger.error(
      { err: e, lpa },
      'Unable to send appeal submission received notification email to LPA.'
    );
  }
}

module.exports = {
  sendAppealSubmissionReceivedNotificationEmailToLpa,
  sendAppealSubmissionConfirmationEmailToAppellant,
};
