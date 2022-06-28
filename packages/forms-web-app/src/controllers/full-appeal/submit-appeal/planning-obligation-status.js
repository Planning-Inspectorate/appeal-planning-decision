const {
	constants: { PLANNING_OBLIGATION_STATUS_OPTION }
} = require('@pins/business-rules');
const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: {
			PLANNING_OBLIGATION_STATUS,
			PLANNING_OBLIGATION_DOCUMENTS,
			DRAFT_PLANNING_OBLIGATION,
			PLANNING_OBLIGATION_DEADLINE
		}
	}
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealDocumentsSection';
const taskName = 'planningObligationDeadline';

const getPlanningObligationStatus = (req, res) => {
	const { planningObligationStatus } = req.session.appeal[sectionName][taskName];
	res.render(PLANNING_OBLIGATION_STATUS, {
		planningObligationStatus
	});
};

const postPlanningObligationStatus = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	if (Object.keys(errors).length > 0) {
		return res.render(PLANNING_OBLIGATION_STATUS, {
			errors,
			errorSummary
		});
	}

	const planningObligationStatus = body['planning-obligation-status'];

	try {
		appeal[sectionName][taskName].planningObligationStatus = planningObligationStatus;
		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName].planningObligationStatus = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			switch (planningObligationStatus) {
				case PLANNING_OBLIGATION_STATUS_OPTION.FINALISED:
					return res.redirect(`/${PLANNING_OBLIGATION_DOCUMENTS}`);
				case PLANNING_OBLIGATION_STATUS_OPTION.DRAFT:
					return res.redirect(`/${DRAFT_PLANNING_OBLIGATION}`);
				case PLANNING_OBLIGATION_STATUS_OPTION.NOT_STARTED:
					return res.redirect(`/${PLANNING_OBLIGATION_DEADLINE}`);
				default:
					return res.redirect(`/${PLANNING_OBLIGATION_STATUS}`);
			}
		}
		appeal.sectionStates[sectionName].planningObligationStatus = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);

		return res.render(PLANNING_OBLIGATION_STATUS, {
			planningObligationStatus,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getPlanningObligationStatus,
	postPlanningObligationStatus
};
