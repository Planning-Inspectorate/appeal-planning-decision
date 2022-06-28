const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const logger = require('../../lib/logger');
const { getNextTask } = require('../../services/task.service');
const { getTaskStatus } = require('../../services/task.service');

const sectionName = 'aboutYouSection';
const taskName = 'yourDetails';

exports.getApplicantName = (req, res) => {
	res.render(VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME, {
		appeal: req.session.appeal
	});
};

exports.postApplicantName = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	const { appeal } = req.session;
	const task = appeal[sectionName][taskName];

	task.appealingOnBehalfOf = req.body['behalf-appellant-name'];

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME, {
			appeal,
			errors,
			errorSummary
		});
		return;
	}

	try {
		appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);
		res.render(VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	res.redirect(getNextTask(appeal, { sectionName, taskName }).href);
};
