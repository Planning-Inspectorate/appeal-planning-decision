const uuid = require('uuid');
const { storePdfAppeal } = require('../../../services/pdf.service');
const { VIEW } = require('../../../lib/full-appeal/views');
const { submitAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');

const {
  FULL_APPEAL: { DECLARATION: currentPage, APPEAL_SUBMITTED },
} = VIEW;

exports.getDeclaration = (req, res) => {
  res.render(currentPage);
};

exports.postDeclaration = async (req, res) => {
  const { body } = req;
  const { errors = {} } = body;
  const { appeal } = req.session;

  const log = logger.child({ appealId: appeal.id, uuid: uuid.v4() });

  log.info('Submitting the appeal');

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
    res.redirect(`/${APPEAL_SUBMITTED}`);
  } catch (e) {
    log.error({ e }, 'The appeal submission failed');
    res.render(currentPage, {
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
  }
};
