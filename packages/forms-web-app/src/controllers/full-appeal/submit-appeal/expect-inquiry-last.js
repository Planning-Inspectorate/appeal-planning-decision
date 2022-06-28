const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { EXPECT_ENQUIRY_LAST, DRAFT_STATEMENT_COMMON_GROUND }
	}
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealDecisionSection';
const taskName = 'inquiry';

const getExpectInquiryLast = (req, res) => {
	const { expectedDays } = req.session.appeal[sectionName][taskName];
	res.render(EXPECT_ENQUIRY_LAST, {
		expectedDays
	});
};

const postExpectInquiryLast = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] },
		session: { appeal }
	} = req;

	const expectedDays = body['expected-days'];

	if (Object.keys(errors).length > 0) {
		return res.render(EXPECT_ENQUIRY_LAST, {
			expectedDays,
			errors,
			errorSummary
		});
	}

	try {
		appeal[sectionName][taskName].expectedDays = expectedDays;
		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName].inquiryExpectedDays = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(`/${DRAFT_STATEMENT_COMMON_GROUND}`);
		}
		appeal.sectionStates[sectionName].inquiryExpectedDays = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);

		return res.render(EXPECT_ENQUIRY_LAST, {
			expectedDays,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getExpectInquiryLast,
	postExpectInquiryLast
};
