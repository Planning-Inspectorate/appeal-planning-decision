const {
	constants: {
		APPLICATION_DECISION: { NODECISIONRECEIVED }
	}
} = require('@pins/business-rules');
const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: {
			DECISION_LETTER,
			DESIGN_ACCESS_STATEMENT_SUBMITTED,
			DESIGN_ACCESS_STATEMENT,
			LETTER_CONFIRMING_APPLICATION
		}
	}
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'designAccessStatement';

const getDesignAccessStatementSubmitted = (req, res) => {
	const {
		appeal: {
			[sectionName]: {
				[taskName]: { isSubmitted }
			}
		}
	} = req.session;
	res.render(DESIGN_ACCESS_STATEMENT_SUBMITTED, {
		isSubmitted
	});
};

const postDesignAccessStatementSubmitted = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] },
		session: {
			appeal,
			appeal: {
				eligibility: { applicationDecision }
			}
		}
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(DESIGN_ACCESS_STATEMENT_SUBMITTED, {
			errors,
			errorSummary
		});
	}

	const isSubmitted = body['design-access-statement-submitted'] === 'yes';

	if (!isSubmitted) {
		appeal[sectionName][taskName].uploadedFile = {};
	}

	try {
		appeal[sectionName][taskName].isSubmitted = isSubmitted;
		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName].designAccessStatementSubmitted = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			if (isSubmitted) {
				return res.redirect(`/${DESIGN_ACCESS_STATEMENT}`);
			} else if (applicationDecision === NODECISIONRECEIVED) {
				return res.redirect(`/${LETTER_CONFIRMING_APPLICATION}`);
			}
			return res.redirect(`/${DECISION_LETTER}`);
		}
		appeal.sectionStates[sectionName].designAccessStatementSubmitted = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);

		return res.render(DESIGN_ACCESS_STATEMENT_SUBMITTED, {
			isSubmitted,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getDesignAccessStatementSubmitted,
	postDesignAccessStatementSubmitted
};
