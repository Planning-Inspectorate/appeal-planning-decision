const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const axios = require('axios');
const config = require('./config');
const logger = require('./logger');

async function sendAppealReplySubmissionConfirmationEmailToLpa(reply) {
  let appeal = {};
  let lpa = {};
  let pdf = '';

  if (!reply.appealId) {
    logger.error('reply.appealId was undefined. Aborting.');
    return;
  }

  try {
    const appealUrl = `${config.appeals.url}/api/v1/appeals/${reply.appealId}`;
    const appealRes = await axios.get(appealUrl);
    appeal = appealRes.data;
  } catch (err) {
    logger.error({ err }, 'Unable to retrieve appeal data.');
    return;
  }

  if (!appeal?.lpaCode) {
    logger.error('appeal.lpaCode was undefined. Aborting.');
    return;
  }

  try {
    const lpaUrl = `${config.appeals.url}/api/v1/local-planning-authorities/${appeal.lpaCode}`;
    const lpaRes = await axios.get(lpaUrl);
    lpa = lpaRes.data;
  } catch (err) {
    logger.error({ err }, 'Unable to retrieve LPA data.');
    return;
  }

  try {
    const pdfUrl = `${config.docs.api.url}/api/v1/${reply.id}/${reply.submission.pdfStatement.uploadedFile.id}/file`;
    logger.info({ docsPath: pdfUrl }, 'docs service route');
    const pdfRes = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    pdf = pdfRes.data;
  } catch (err) {
    logger.error({ err }, 'Unable to retrieve PDF data.');
    return;
  }

  try {
    if (!lpa.email) {
      throw new Error('Missing LPA email. This indicates an issue with the look up data.');
    }

    await NotifyBuilder.setTemplateId(
      config.services.notify.templates.appealReplySubmissionConfirmation
    )
      .setEmailReplyToId(config.services.notify.emailReplyToId.appealReplySubmissionConfirmation)
      .setDestinationEmailAddress(lpa.email)
      .setTemplateVariablesFromObject({
        'Planning appeal number': appeal.horizonId,
        'Name of local planning department': lpa.name,
        'Planning application number': appeal.requiredDocumentsSection.applicationNumber,
      })
      .addFileToTemplateVariables('link to appeal questionnaire pdf', pdf)
      .setReference(`${appeal.id}.SubmissionConfirmation`)
      .sendEmailClient();
  } catch (e) {
    logger.error(
      { err: e, lpa },
      'Unable to send appeal submission received notification email to LPA.'
    );
  }
}

module.exports = {
  sendAppealReplySubmissionConfirmationEmailToLpa,
};
