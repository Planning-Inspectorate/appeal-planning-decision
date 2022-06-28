const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { APPLICANT_NAME: currentPage, CONTACT_DETAILS }
	}
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'contactDetailsSection';
const taskName = 'appealingOnBehalfOf';

exports.getApplicantName = (req, res) => {
	res.render(currentPage, {
		appeal: req.session.appeal
	});
};

exports.postApplicantName = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	const { appeal } = req.session;
	const task = appeal[sectionName][taskName];

	task.name = req.body['behalf-appellant-name'];
	task.companyName = req.body['company-name'];

	if (Object.keys(errors).length > 0) {
		return res.render(currentPage, {
			appeal,
			errors,
			errorSummary
		});
	}

	try {
		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(`/${CONTACT_DETAILS}`);
		}
		appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (e) {
		logger.error(e);
		return res.render(currentPage, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};
