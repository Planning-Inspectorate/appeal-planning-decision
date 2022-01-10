const { documentTypes } = require('@pins/common');
const {
  VIEW: {
    FULL_APPEAL: { APPLICATION_FORM, APPLICATION_NUMBER },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../services/task.service');

const sectionName = 'requiredDocumentsSection';
const taskName = documentTypes.originalApplication.name;
const viewData = (appeal, errorSummary, errors) => {
  return {
    appealId: appeal.id,
    uploadedFile: appeal[sectionName][taskName] && appeal[sectionName][taskName].uploadedFile,
    errorSummary,
    errors,
  };
};

const getApplicationForm = (req, res) => {
  const { appeal } = req.session;
  res.render(APPLICATION_FORM, viewData(appeal));
};

const postApplicationForm = async (req, res) => {
  const {
    body: { errors = {}, errorSummary = [] },
    files = {},
    session: { appeal },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(APPLICATION_FORM, viewData(appeal, errorSummary, errors));
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
  } catch (err) {
    logger.error(err);
    return res.render(APPLICATION_FORM, viewData(appeal, [{ text: err.toString(), href: '#' }]));
  }

  return res.redirect(`/${APPLICATION_NUMBER}`);
};

module.exports = {
  getApplicationForm,
  postApplicationForm,
};
