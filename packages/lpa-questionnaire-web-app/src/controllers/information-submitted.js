const fetch = require('node-fetch');
const config = require('../config');
const { VIEW } = require('../lib/views');
const { createOrUpdateAppealReply } = require('../lib/appeal-reply-api-wrapper');
const logger = require('../lib/logger');
const { createPdf } = require('../services/pdf.service');

exports.getInformationSubmitted = async (req, res) => {
  const { lpaCode } = req.session.appeal;
  const path = `/api/v1/local-planning-authorities/${lpaCode}`;
  const url = `${config.appeals.url}${path}`;
  let lpaEmailString;
  try {
    const response = await fetch(url);
    const data = await response.json();
    lpaEmailString = `We’ve sent a confirmation email to ${data.email}.`;
    req.log.info('LPA Email recevied successfully');
  } catch (error) {
    lpaEmailString = '';
    req.log.error({ error }, 'Get LPA Email failed');
  }

  res.render(VIEW.INFORMATION_SUBMITTED, {
    lpaEmailString,
  });
};

exports.postInformationSubmitted = async (req, res) => {
  const { appealReply, appeal } = req.session;
  const log = logger.child({ appealReplyId: appealReply.id });

  log.info('Submitting the appeal reply');

  try {
    appealReply.submissionDate = new Date();
    const { id, name } = await createPdf(appealReply, appeal);

    appealReply.state = 'SUBMITTED';

    appealReply.submission = {
      pdfStatement: {
        uploadedFile: {
          id,
          name,
        },
      },
    };

    req.session.appealReply = await createOrUpdateAppealReply(appealReply);

    log.debug('Appeal Reply successfully submitted');
  } catch (err) {
    log.error({ err }, 'Appeal Reply submission failed');
    res.status(500).send();
    return;
  }

  // redirect ensures any custom handling in get runs as expected
  res.redirect(`/${req.params.id}/${VIEW.INFORMATION_SUBMITTED}`);
};
