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
  const {
    [sectionName]: {
      [taskName]: { hasSupportingDocuments },
      plansDrawings: { hasPlansDrawings },
    },
  } = req.session.appeal;
  res.render(SUPPORTING_DOCUMENTS, {
    hasSupportingDocuments,
    hasPlansDrawings,
  });
};

const postSupportingDocuments = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: {
      appeal,
      appeal: {
        [sectionName]: {
          plansDrawings: { hasPlansDrawings },
        },
      },
    },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(SUPPORTING_DOCUMENTS, {
      hasPlansDrawings,
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
      hasPlansDrawings,
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
