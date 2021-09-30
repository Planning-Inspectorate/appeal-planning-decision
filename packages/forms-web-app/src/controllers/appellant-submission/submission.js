const uuid = require('uuid');
const { storePdfAppeal } = require('../../services/pdf.service');

const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');

exports.getSubmission = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.SUBMISSION);
};

exports.postSubmission = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  const log = logger.child({ appealId: appeal.id, uuid: uuid.v4() });

  log.info('Submitting the appeal');

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.SUBMISSION, {
      errors,
      errorSummary,
    });
    return;
  }

  if (body['appellant-confirmation'] === 'i-agree') {
    try {
      const { id, name, location, size } = await storePdfAppeal(appeal);

      appeal.state = 'SUBMITTED';

      appeal.appealSubmission = {
        appealPDFStatement: {
          uploadedFile: {
            id,
            name,
            fileName: name,
            originalFileName: name,
            location,
            size,
          },
        },
      };

      req.session.appeal = await createOrUpdateAppeal(appeal);
      log.debug('Appeal successfully submitted');
    } catch (e) {
      log.error({ e }, 'The appeal submission failed');
      res.render(VIEW.APPELLANT_SUBMISSION.SUBMISSION, {
        errors,
        errorSummary: [{ text: e.toString(), href: '#' }],
      });
      return;
    }

    res.redirect(`/${VIEW.APPELLANT_SUBMISSION.CONFIRMATION}`);
    return;
  }

  res.redirect(`/${VIEW.APPELLANT_SUBMISSION.SUBMISSION}`);
};
