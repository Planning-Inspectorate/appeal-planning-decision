const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { PLANS_DRAWINGS, NEW_PLANS_DRAWINGS, PLANNING_OBLIGATION_PLANNED }
	}
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealDocumentsSection';
const taskName = 'plansDrawings';

const getNewPlansDrawings = (req, res) => {
	const { hasPlansDrawings } = req.session.appeal[sectionName][taskName];
	res.render(NEW_PLANS_DRAWINGS, {
		hasPlansDrawings
	});
};

const postNewPlansDrawings = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] },
		session: { appeal }
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(NEW_PLANS_DRAWINGS, {
			errors,
			errorSummary
		});
	}

	const hasPlansDrawings = body['plans-drawings'] === 'yes';

	if (!hasPlansDrawings) {
		appeal[sectionName][taskName].uploadedFiles = [];
	}

	try {
		appeal[sectionName][taskName].hasPlansDrawings = hasPlansDrawings;
		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName].newPlansDrawings = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return hasPlansDrawings
				? res.redirect(`/${PLANS_DRAWINGS}`)
				: res.redirect(`/${PLANNING_OBLIGATION_PLANNED}`);
		}
		appeal.sectionStates[sectionName].newPlansDrawings = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);

		return res.render(NEW_PLANS_DRAWINGS, {
			hasPlansDrawings,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getNewPlansDrawings,
	postNewPlansDrawings
};
