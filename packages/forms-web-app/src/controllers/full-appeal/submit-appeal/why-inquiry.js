const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { EXPECT_ENQUIRY_LAST, WHY_INQUIRY },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDecisionSection';
const taskName = 'inquiry';

const getWhyInquiry = (req, res) => {
  const { reason } = req.session.appeal[sectionName][taskName];
  res.render(WHY_INQUIRY, {
    reason,
  });
};

const postWhyInquiry = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  const reason = body['why-inquiry'];

  if (Object.keys(errors).length > 0) {
    return res.render(WHY_INQUIRY, {
      reason,
      errors,
      errorSummary,
    });
  }

  try {
    appeal[sectionName][taskName].reason = reason;
    appeal.sectionStates[sectionName][taskName] = COMPLETED;

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(WHY_INQUIRY, {
      reason,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${EXPECT_ENQUIRY_LAST}`);
};

module.exports = {
  getWhyInquiry,
  postWhyInquiry,
};
