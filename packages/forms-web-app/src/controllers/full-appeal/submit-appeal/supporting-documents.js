const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { NEW_SUPPORTING_DOCUMENTS, SUPPORTING_DOCUMENTS, TASK_LIST },
  },
} = require('../../../lib/full-appeal/views');
// const { getTaskStatus } = require('../../../services/task.service');
const { NOT_STARTED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDocumentsSection';
const taskName = 'supportingDocuments';

const getSupportingDocuments = (req, res) => {
  const { hasSupportingDocuments } = req.session.appeal[sectionName][taskName];
  res.render(SUPPORTING_DOCUMENTS, {
    hasSupportingDocuments,
  });
};

const postSupportingDocuments = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(SUPPORTING_DOCUMENTS, {
      errors,
      errorSummary,
    });
  }

  const hasSupportingDocuments = body['supporting-documents'] === 'yes';

  try {
    appeal[sectionName][taskName].hasSupportingDocuments = hasSupportingDocuments;
    // appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    appeal.sectionStates[sectionName][taskName] = NOT_STARTED;

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(SUPPORTING_DOCUMENTS, {
      hasSupportingDocuments,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return hasSupportingDocuments
    ? res.redirect(`/${NEW_SUPPORTING_DOCUMENTS}`)
    : res.redirect(`/${TASK_LIST}`);
};

module.exports = {
  getSupportingDocuments,
  postSupportingDocuments,
};
