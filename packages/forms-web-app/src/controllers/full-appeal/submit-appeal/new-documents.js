const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { NEW_DOCUMENTS, OTHER_SUPPORTING_DOCUMENTS, TASK_LIST },
  },
} = require('../../../lib/full-appeal/views');

const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDocumentsSection';
const taskName = 'supportingDocuments';

const getNewSupportingDocuments = (req, res) => {
  const {
    [sectionName]: {
      [taskName]: { hasSupportingDocuments },
    },
  } = req.session.appeal;
  const backLink = req.headers.referer;
  res.render(NEW_DOCUMENTS, {
    backLink,
    hasSupportingDocuments,
  });
};

const postNewSupportingDocuments = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;
  const backLink = req.headers.referer;

  if (Object.keys(errors).length > 0) {
    return res.render(NEW_DOCUMENTS, {
      backLink,
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
      backLink,
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
