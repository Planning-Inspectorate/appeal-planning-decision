const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: {
      OTHER_SUPPORTING_DOCUMENTS,
      NEW_DOCUMENTS,
      TASK_LIST,
      PLANNING_OBLIGATION_PLANNED,
    },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDocumentsSection';
const taskName = 'supportingDocuments';
const backLink = `/${PLANNING_OBLIGATION_PLANNED}`;

const getNewSupportingDocuments = (req, res) => {
  const {
    [sectionName]: {
      [taskName]: { hasSupportingDocuments },
      plansDrawings: { hasPlansDrawings },
    },
  } = req.session.appeal;
  res.render(NEW_DOCUMENTS, {
    backLink,
    hasSupportingDocuments,
    hasPlansDrawings,
  });
};

const postNewSupportingDocuments = async (req, res) => {
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
    return res.render(NEW_DOCUMENTS, {
      hasPlansDrawings,
      errors,
      errorSummary,
    });
  }

  const hasSupportingDocuments = body['supporting-documents'] === 'yes';

  try {
    appeal[sectionName][taskName].hasSupportingDocuments = hasSupportingDocuments;
    appeal.sectionStates[sectionName][taskName] = COMPLETED;

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(NEW_DOCUMENTS, {
      hasSupportingDocuments,
      hasPlansDrawings,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return hasSupportingDocuments
    ? res.redirect(`/${OTHER_SUPPORTING_DOCUMENTS}`)
    : res.redirect(`/${TASK_LIST}`);
};

module.exports = {
  getNewSupportingDocuments,
  postNewSupportingDocuments,
};
