const {
	constants: {
		PROCEDURE_TYPE: { HEARING, INQUIRY }
	}
} = require('@pins/business-rules');
const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { HOW_DECIDE_APPEAL, TASK_LIST, WHY_HEARING, WHY_INQUIRY }
	}
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealDecisionSection';
const taskName = 'procedureType';

const getHowDecideAppeal = (req, res) => {
	const { procedureType } = req.session.appeal[sectionName];
	res.render(HOW_DECIDE_APPEAL, {
		procedureType
	});
};

const postHowDecideAppeal = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] },
		session: { appeal }
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(HOW_DECIDE_APPEAL, {
			errors,
			errorSummary
		});
	}

	const procedureType = body['procedure-type'];

	try {
		appeal[sectionName][taskName] = procedureType;
		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			switch (procedureType) {
				case HEARING:
					return res.redirect(`/${WHY_HEARING}`);
				case INQUIRY:
					return res.redirect(`/${WHY_INQUIRY}`);
				default:
					return res.redirect(`/${TASK_LIST}`);
			}
		}
		appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);

		return res.render(HOW_DECIDE_APPEAL, {
			procedureType,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getHowDecideAppeal,
	postHowDecideAppeal
};
