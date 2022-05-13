const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { PLANS_DRAWINGS, NEW_PLANS_DRAWINGS, PLANNING_OBLIGATION_PLANNED },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDocumentsSection';
const taskName = 'plansDrawings';

const getPlansDrawings = (req, res) => {
  const { hasPlansDrawings } = req.session.appeal[sectionName][taskName];
  res.render(PLANS_DRAWINGS, {
    hasPlansDrawings,
  });
};

const postPlansDrawings = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(PLANS_DRAWINGS, {
      errors,
      errorSummary,
    });
  }

  const hasPlansDrawings = body['plans-drawings'] === 'yes';

  try {
    appeal[sectionName][taskName].hasPlansDrawings = hasPlansDrawings;
    appeal.sectionStates[sectionName][taskName] = COMPLETED;

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(PLANS_DRAWINGS, {
      hasPlansDrawings,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return hasPlansDrawings
    ? res.redirect(`/${NEW_PLANS_DRAWINGS}`)
    : res.redirect(`/${PLANNING_OBLIGATION_PLANNED}`);
};

module.exports = {
  getPlansDrawings,
  postPlansDrawings,
};
