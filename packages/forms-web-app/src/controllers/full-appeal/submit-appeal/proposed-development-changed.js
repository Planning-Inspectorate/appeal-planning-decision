const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { PLANS_DRAWINGS_DOCUMENTS, PROPOSED_DEVELOPMENT_CHANGED }
	}
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'descriptionDevelopmentCorrect';

const getProposedDevelopmentChanged = (req, res) => {
	const { descriptionDevelopmentCorrect } = req.session.appeal[sectionName];
	res.render(PROPOSED_DEVELOPMENT_CHANGED, {
		descriptionDevelopmentCorrect
	});
};

const postProposedDevelopmentChanged = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	const descriptionDevelopmentCorrect = {
		isCorrect: body['description-development-correct'] === 'yes',
		details:
			body['description-development-correct'] === 'no'
				? body['description-development-correct-details']
				: ''
	};

	if (Object.keys(errors).length > 0) {
		return res.render(PROPOSED_DEVELOPMENT_CHANGED, {
			descriptionDevelopmentCorrect,
			errors,
			errorSummary
		});
	}

	try {
		appeal.sectionStates[sectionName][taskName] = COMPLETED;
		appeal[sectionName][taskName] = descriptionDevelopmentCorrect;

		if (req.body['save-and-return'] !== '') {
			req.session.appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);

			return res.redirect(`/${PLANS_DRAWINGS_DOCUMENTS}`);
		}

		appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);

		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);

		return res.render(PROPOSED_DEVELOPMENT_CHANGED, {
			descriptionDevelopmentCorrect,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getProposedDevelopmentChanged,
	postProposedDevelopmentChanged
};
