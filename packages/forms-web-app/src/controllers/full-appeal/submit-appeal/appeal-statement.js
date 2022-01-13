const { documentTypes } = require('@pins/common');
const {
  VIEW: {
    FULL_APPEAL: { APPEAL_STATEMENT, PLANS_DRAWINGS },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../services/task.service');

const sectionName = 'yourAppealSection';
const taskName = documentTypes.appealStatement.name;
const viewData = (appeal, errorSummary, errors) => {
  const section = appeal[sectionName][taskName];
  return {
    appealId: appeal.id,
    uploadedFile: section && section.uploadedFile,
    hasSensitiveInformation: section && section.hasSensitiveInformation,
    errorSummary,
    errors,
  };
};

const getAppealStatement = (req, res) => {
  const { appeal } = req.session;
  res.render(APPEAL_STATEMENT, viewData(appeal));
};

const postAppealStatement = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    files = {},
    session: { appeal },
  } = req;

  if (!appeal[sectionName][taskName]) {
    appeal[sectionName][taskName] = {};
  }

  appeal[sectionName][taskName].hasSensitiveInformation =
    body['does-not-include-sensitive-information'] !== 'i-confirm';

  if (Object.keys(errors).length > 0) {
    return res.render(APPEAL_STATEMENT, viewData(appeal, errorSummary, errors));
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
    return res.render(APPEAL_STATEMENT, viewData(appeal, [{ text: err.toString(), href: '#' }]));
  }

  return res.redirect(`/${PLANS_DRAWINGS}`);
};

module.exports = {
  getAppealStatement,
  postAppealStatement,
};
