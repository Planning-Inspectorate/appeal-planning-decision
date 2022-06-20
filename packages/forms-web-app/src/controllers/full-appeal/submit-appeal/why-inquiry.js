const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { EXPECT_ENQUIRY_LAST, WHY_INQUIRY },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

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
    if (req.body['save-and-return'] !== '') {
      appeal.sectionStates[sectionName][taskName] = COMPLETED;
      req.session.appeal = await createOrUpdateAppeal(appeal);
      return res.redirect(`/${EXPECT_ENQUIRY_LAST}`);
    }
    appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
    req.session.appeal = await createOrUpdateAppeal(appeal);
    return await postSaveAndReturn(req, res);
  } catch (err) {
    logger.error(err);

    return res.render(WHY_INQUIRY, {
      reason,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }
};

module.exports = {
  getWhyInquiry,
  postWhyInquiry,
};
