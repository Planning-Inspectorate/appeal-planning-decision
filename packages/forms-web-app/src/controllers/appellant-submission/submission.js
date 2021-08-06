const uuid = require('uuid');
const { validation } = require('@pins/business-rules');
const { storePdfAppeal } = require('../../services/pdf.service');
const { VIEW } = require('../../lib/views');
const { submitAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');

exports.getSubmission = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.SUBMISSION);
};

exports.postSubmission = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const {
    appeal,
    appeal: { decisionDate },
  } = req.session;

  const log = logger.child({ appealId: appeal.id, uuid: uuid.v4() });

  log.info('Submitting the appeal');

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.SUBMISSION, {
      errors,
      errorSummary,
    });
    return;
  }

  if (body['appellant-confirmation'] !== 'i-agree') {
    res.redirect(`/${VIEW.APPELLANT_SUBMISSION.SUBMISSION}`);
    return;
  }

  const isWithinExpiryPeriod =
    decisionDate &&
    validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod(new Date(decisionDate));

  if (!isWithinExpiryPeriod) {
    res.redirect(`/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`);
    return;
  }

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

    req.session.appeal = await submitAppeal(appeal);
    log.debug('Appeal successfully submitted');
    res.redirect(`/${VIEW.APPELLANT_SUBMISSION.CONFIRMATION}`);
  } catch (e) {
    log.error({ e }, 'The appeal submission failed');
    res.render(VIEW.APPELLANT_SUBMISSION.SUBMISSION, {
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
  }
};
