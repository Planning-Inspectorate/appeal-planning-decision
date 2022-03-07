const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { EXPECT_ENQUIRY_LAST, DRAFT_STATEMENT_COMMON_GROUND },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDecisionSection';
const taskName = 'inquiry';

const getExpectInquiryLast = (req, res) => {
  const { expectedDays } = req.session.appeal[sectionName][taskName];
  res.render(EXPECT_ENQUIRY_LAST, {
    expectedDays,
  });
};

const postExpectInquiryLast = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  const expectedDays = body['expected-days'];

  if (Object.keys(errors).length > 0) {
    return res.render(EXPECT_ENQUIRY_LAST, {
      expectedDays,
      errors,
      errorSummary,
    });
  }

  try {
    appeal[sectionName][taskName].expectedDays = expectedDays;
    appeal.sectionStates[sectionName].inquiryExpectedDays = COMPLETED;

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(EXPECT_ENQUIRY_LAST, {
      expectedDays,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${DRAFT_STATEMENT_COMMON_GROUND}`);
};

module.exports = {
  getExpectInquiryLast,
  postExpectInquiryLast,
};
