const { documentTypes } = require('@pins/common');
const { VIEW } = require('../../../lib/full-planning/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../services/task.service');

const getApplicationForm = (req, res) => {
  res.render(VIEW.FULL_APPEAL.APPLICATION_FORM);
};

const postApplicationForm = async (req, res) => {
  const {
    body: { errors = {}, errorSummary = [] },
    files = {},
    session: { appeal },
  } = req;
  const sectionName = 'requiredDocumentsSection';
  const taskName = documentTypes.originalApplication.name;

  if (Object.keys(errors).length > 0) {
    return res.render(VIEW.FULL_APPEAL.APPLICATION_FORM, {
      appeal,
      errors,
      errorSummary,
    });
  }

  try {
    const document = await createDocument(appeal, files['file-upload'], null, taskName);

    appeal[sectionName][taskName].uploadedFile = {
      id: document.id,
      name: files['file-upload'].name,
      fileName: files['file-upload'].name,
      originalFileName: files['file-upload'].name,
      location: document.location,
      size: document.size,
    };
    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);
    return res.render(VIEW.FULL_APPEAL.APPLICATION_FORM, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
  }

  return res.redirect('/full-appeal/application-number');
};

module.exports = {
  getApplicationForm,
  postApplicationForm,
};
