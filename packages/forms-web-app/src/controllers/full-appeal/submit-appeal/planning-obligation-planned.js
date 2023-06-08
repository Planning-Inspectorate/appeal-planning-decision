const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { VIEW } = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const logger = require('../../../lib/logger');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealDocumentsSection';
const taskName = 'planningObligations';

const getPlanningObligationPlanned = async (req, res) => {
	const { plansPlanningObligation } = req.session.appeal[sectionName][taskName];
	res.render(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, { plansPlanningObligation });
};

const postPlanningObligationPlanned = async (req, res) => {
	const {
		body,
		session: { appeal }
	} = req;
	const { errors = {}, errorSummary = [] } = body;

	if (Object.keys(errors).length > 0) {
		return res.render(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, {
			errors,
			errorSummary
		});
	}

	const plansPlanningObligation = body['plan-to-submit-planning-obligation'] === 'yes';

	if (!plansPlanningObligation) {
		appeal[sectionName].planningObligationDeadline.planningObligationStatus = null;
		appeal[sectionName][taskName].plansPlanningObligation = false;
		appeal[sectionName][taskName].uploadedFiles = [];
		appeal[sectionName].draftPlanningObligations.uploadedFiles = [];
	}

	try {
		appeal[sectionName][taskName].plansPlanningObligation = plansPlanningObligation;
		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName].plansPlanningObligation = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return plansPlanningObligation
				? res.redirect(`/${VIEW.FULL_APPEAL.PLANNING_OBLIGATION_STATUS}`)
				: res.redirect(`/${VIEW.FULL_APPEAL.NEW_DOCUMENTS}`);
		}
		appeal.sectionStates[sectionName].plansPlanningObligation = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);
		return res.render(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, {
			plansPlanningObligation,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = { getPlanningObligationPlanned, postPlanningObligationPlanned };
