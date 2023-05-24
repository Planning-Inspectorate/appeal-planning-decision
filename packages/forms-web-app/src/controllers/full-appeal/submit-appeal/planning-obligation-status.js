const {
	constants: { PLANNING_OBLIGATION_STATUS_OPTION }
} = require('@pins/business-rules');
const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: {
			PLANNING_OBLIGATION_STATUS,
			PLANNING_OBLIGATION,
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

	let nextPage;

	switch (planningObligationStatus) {
		case PLANNING_OBLIGATION_STATUS_OPTION.DRAFT:
			appeal[sectionName].planningObligations.uploadedFiles = [];
			nextPage = DRAFT_PLANNING_OBLIGATION;
			break;
		case PLANNING_OBLIGATION_STATUS_OPTION.FINALISED:
			appeal[sectionName].draftPlanningObligations.uploadedFiles = [];
			nextPage = PLANNING_OBLIGATION;
			break;
		case PLANNING_OBLIGATION_STATUS_OPTION.NOT_STARTED:
			appeal[sectionName].planningObligations.uploadedFiles = [];
			appeal[sectionName].draftPlanningObligations.uploadedFiles = [];
			nextPage = PLANNING_OBLIGATION_DEADLINE;
			break;
		default:
			nextPage = PLANNING_OBLIGATION_STATUS;
			break;
	}

	try {
		appeal[sectionName][taskName].planningObligationStatus = planningObligationStatus;
		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName].planningObligationStatus = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(`/${nextPage}`);
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
