const { documentTypes } = require('@pins/common');
const {
  VIEW: {
    FULL_APPEAL: { DECISION_LETTER, TASK_LIST },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../services/task.service');

const sectionName = 'requiredDocumentsSection';
const taskName = documentTypes.decisionLetter.name;
const viewData = (appeal, errorSummary, errors) => {
  return {
    appealId: appeal.id,
    uploadedFile: appeal[sectionName][taskName] && appeal[sectionName][taskName].uploadedFile,
    errorSummary,
    errors,
  };
};

const getDecisionLetter = (req, res) => {
  const { appeal } = req.session;
  res.render(DECISION_LETTER, viewData(appeal));
};

const postDecisionLetter = async (req, res) => {
  const {
    body: { errors = {}, errorSummary = [] },
    files = {},
    session: { appeal },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(DECISION_LETTER, viewData(appeal, errorSummary, errors));
  }

  try {
    const document = await createDocument(appeal, files['file-upload'], null, taskName);

    if (!appeal[sectionName][taskName]) {
      appeal[sectionName][taskName] = {};
    }

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
    return res.render(DECISION_LETTER, viewData(appeal, [{ text: err.toString(), href: '#' }]));
  }

  return res.redirect(`/${TASK_LIST}`);
};

module.exports = {
  getDecisionLetter,
  postDecisionLetter,
};
