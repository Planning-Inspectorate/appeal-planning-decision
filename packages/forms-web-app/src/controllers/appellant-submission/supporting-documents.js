const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { createDocument } = require('../../lib/documents-api-wrapper');
const { getNextUncompletedTask } = require('../../services/task.service');
const { getTaskStatus } = require('../../services/task.service');

const sectionName = 'yourAppealSection';
const taskName = 'otherDocuments';

exports.getSupportingDocuments = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS, {
    appeal: req.session.appeal,
  });
};

exports.postSupportingDocuments = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS, {
      appeal: req.session.appeal,
      errors,
      errorSummary,
    });
    return;
  }

  const { appeal } = req.session;

  try {
    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);

    if ('files' in req && req.files !== null && 'supporting-documents' in req.files) {
      const supportingDocuments = Array.isArray(req.files['supporting-documents'])
        ? req.files['supporting-documents']
        : [req.files['supporting-documents']];

      // eslint-disable-next-line no-restricted-syntax
      for await (const file of supportingDocuments) {
        const document = await createDocument(appeal, file);

        appeal[sectionName][taskName].documents.push({
          id: document.id,
          name: file.name,
          // needed for MoJ multi-file upload display
          message: {
            text: file.name,
          },
          fileName: file.name,
          originalFileName: file.name,
          // needed for Cypress testing
          location: document.location,
          size: document.size,
        });
      }
    }

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);
    res.render(VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  res.redirect(getNextUncompletedTask(appeal, { sectionName, taskName }).href);
};
