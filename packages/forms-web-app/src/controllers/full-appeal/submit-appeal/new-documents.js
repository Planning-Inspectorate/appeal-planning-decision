const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: {
      NEW_DOCUMENTS,
      OTHER_SUPPORTING_DOCUMENTS,
      TASK_LIST,
      PLANNING_OBLIGATION_PLANNED,
      PLANNING_OBLIGATION_DOCUMENTS,
      PLANNING_OBLIGATION_DEADLINE,
      DRAFT_PLANNING_OBLIGATION,
    },
  },
} = require('../../../lib/full-appeal/views');
const {
  constants: { PLANNING_OBLIGATION_STATUS_OPTION },
} = require('@pins/business-rules');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDocumentsSection';
const taskName = 'supportingDocuments';

const getBackLink = (planningObligation, status) => {
  if (planningObligation) {
    switch (status) {
      case PLANNING_OBLIGATION_STATUS_OPTION.FINALISED:
        return `/${PLANNING_OBLIGATION_DOCUMENTS}`;
      case PLANNING_OBLIGATION_STATUS_OPTION.DRAFT:
        return `/${DRAFT_PLANNING_OBLIGATION}`;
      case PLANNING_OBLIGATION_STATUS_OPTION.NOT_STARTED:
        return `/${PLANNING_OBLIGATION_DEADLINE}`;
    }
  } else {
    return `/${PLANNING_OBLIGATION_PLANNED}`;
  }
};

const getNewSupportingDocuments = (req, res) => {
  const {
    [sectionName]: {
      [taskName]: { hasSupportingDocuments },
      planningObligations: { plansPlanningObligation, planningObligationStatus },
    },
  } = req.session.appeal;
  const backLink = getBackLink(plansPlanningObligation, planningObligationStatus);
  res.render(NEW_DOCUMENTS, {
    backLink,
    hasSupportingDocuments,
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
          planningObligations: { plansPlanningObligation, planningObligationStatus },
        },
      },
    },
  } = req;
  const backLink = getBackLink(plansPlanningObligation, planningObligationStatus);

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
