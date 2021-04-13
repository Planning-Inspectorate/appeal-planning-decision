const { VIEW } = require('../lib/views');
const { createOrUpdateAppealReply } = require('../lib/appeal-reply-api-wrapper');
const logger = require('../lib/logger');
const { createPdf } = require('../services/pdf.service');

exports.getInformationSubmitted = (req, res) => {
  res.render(VIEW.INFORMATION_SUBMITTED, {
    appealReplyId: req.session?.appealReply?.id,
  });
};

exports.postInformationSubmitted = async (req, res) => {
  const { appealReply, appeal } = req.session;
  const log = logger.child({ appealReplyId: appealReply.id });

  log.info('Submitting the appeal reply');

  try {
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
