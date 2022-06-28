const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { getTaskStatus, getNextTask } = require('../../services/task.service');
const { VIEW } = require('../../lib/views');

const sectionName = 'aboutYouSection';
const taskName = 'yourDetails';

exports.getYourDetails = (req, res) => {
	res.render(VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS, {
		appeal: req.session.appeal
	});
};

exports.postYourDetails = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	const { appeal } = req.session;
	const task = appeal[sectionName][taskName];

	task.name = req.body['appellant-name'];
	task.email = req.body['appellant-email'];

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS, {
			appeal,
			errors,
			errorSummary
		});
		return;
	}

	try {
		if (task.isOriginalApplicant) {
			task.appealingOnBehalfOf = null;
		}

		appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);
		res.render(VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	if (!task.isOriginalApplicant) {
		res.redirect(`/${VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME}`);
		return;
	}
	res.redirect(getNextTask(appeal, { sectionName, taskName }).href);
};
