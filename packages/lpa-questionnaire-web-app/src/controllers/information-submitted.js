const { VIEW } = require('../lib/views');
const { createOrUpdateAppealReply } = require('../lib/appeal-reply-api-wrapper');
const logger = require('../lib/logger');

exports.getInformationSubmitted = (_, res) => {
  res.render(VIEW.INFORMATION_SUBMITTED, {});
};

exports.postInformationSubmitted = async (req, res) => {
  const { appealReply } = req.session;
  const log = logger.child({ appealReplyId: appealReply.id });

  log.info('Submitting the appeal reply');

  try {
    /**
     * TODO: call PDF service here. something like:
     * const { id, name, location, size } = await createAppealReplyPdf(appealReply);
     */

    appealReply.state = 'SUBMITTED';

    /**
     * TODO: add PDF to submission. Expected structure:
     * appealReply.submission = {
     *   pdfStatement: {
     *     uploadedFile: {
     *       id,
     *       name,
     *       location,
     *       size,
     *     },
     *   },
     * };
     */

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
