const NotifyBuilder = require('@pins/common/src/lib/notify/notify-builder');
const axios = require('axios');
const config = require('./config');
const logger = require('./logger');

async function sendAppealReplySubmissionConfirmationEmailToLpa(reply) {
  let appeal = {};
  let lpa = {};
  let pdf = '';

  try {
    const appealUrl = `${config.appeals.url}/api/v1/appeals/${reply.appealId}`;
    const appealRes = await axios.get(appealUrl);
    appeal = appealRes.data;

    const lpaUrl = `${config.appeals.url}/api/v1/local-planning-authorities/${appeal.lpaCode}`;
    const lpaRes = await axios.get(lpaUrl);
    lpa = lpaRes.data;

    const pdfUrl = `${config.docs.api.url}/api/v1/${reply.id}/${reply.submission.pdfStatement.uploadedFile.id}/file`;
    logger.info({ docsPath: pdfUrl }, 'docs service route');

    const pdfRes = await axios.get(pdfUrl, { responseType: 'blob' });
    pdf = pdfRes.data;
  } catch (err) {
    logger.error({ err }, 'Unable to get data required to send email.');
  }

  try {
    if (!lpa.email) {
      throw new Error('Missing LPA email. This indicates an issue with the look up data.');
    }

    await NotifyBuilder.setTemplateId(
      config.services.notify.templates.appealReplySubmissionConfirmation
    )
      .setDestinationEmailAddress(lpa.email)
      .setTemplateVariablesFromObject({
        'planning appeal reference': appeal.id,
        'name of local planning department': lpa.name,
        'planning application number': appeal.requiredDocumentsSection.applicationNumber,
      })
      .setReference(`${appeal.id}.SubmissionConfirmation`)
      .addFileToTemplateVariables('link to appeal submission pdf', pdf)
      .sendEmail();
  } catch (e) {
    logger.error(
      { err: e, lpa: lpa.data },
      'Unable to send appeal submission received notification email to LPA.'
    );
  }
}

module.exports = {
  sendAppealReplySubmissionConfirmationEmailToLpa,
};
