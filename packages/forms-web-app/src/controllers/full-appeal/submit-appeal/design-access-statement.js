const { documentTypes } = require('@pins/common');
const {
  VIEW: {
    FULL_APPEAL: { DESIGN_ACCESS_STATEMENT, DECISION_LETTER },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../services/task.service');

const sectionName = 'requiredDocumentsSection';
const taskName = documentTypes.designAccessStatement.name;
const viewData = (appeal, errorSummary, errors) => {
  return {
    appealId: appeal.id,
    uploadedFile: appeal[sectionName][taskName] && appeal[sectionName][taskName].uploadedFile,
    errorSummary,
    errors,
  };
};

const getDesignAccessStatement = (req, res) => {
  const { appeal } = req.session;
  logger.debug({ taskName, appeal }, 'taskname');
  res.render(DESIGN_ACCESS_STATEMENT, viewData(appeal));
};

const postDesignAccessStatement = async (req, res) => {
  const {
    body: { errors = {}, errorSummary = [] },
    files = {},
    session: { appeal },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(DESIGN_ACCESS_STATEMENT, viewData(appeal, errorSummary, errors));
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
    return res.render(
      DESIGN_ACCESS_STATEMENT,
      viewData(appeal, [{ text: err.toString(), href: '#' }])
    );
  }

  return res.redirect(`/${DECISION_LETTER}`);
};

module.exports = {
  getDesignAccessStatement,
  postDesignAccessStatement,
};
