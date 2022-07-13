const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { getTaskStatus, getNextTask } = require('../../services/task.service');
const { VIEW } = require('../../lib/views');
const { postSaveAndReturn } = require('../appeal-householder-decision/save');

const sectionName = 'aboutYouSection';
const taskName = 'yourDetails';

const getYourDetails = (req, res) => {
	res.render(VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS, {
		appeal: req.session.appeal
	});
};

const postYourDetails = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	const { appeal } = req.session;
	const task = appeal[sectionName][taskName];

	task.name = req.body['appellant-name'];

	if (Object.keys(errors).length > 0) {
		return res.render(VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS, {
			appeal,
			errors,
			errorSummary
		});
	}

	try {
		if (task.isOriginalApplicant) {
			task.appealingOnBehalfOf = null;
		}

		appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
		if (req.body['save-and-return'] !== '') {
			req.session.appeal = await createOrUpdateAppeal(appeal);
			if (!task.isOriginalApplicant) {
				return res.redirect(`/${VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME}`);
			}
			return res.redirect(getNextTask(appeal, { sectionName, taskName }).href);
		}
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (e) {
		logger.error(e);
		return res.render(VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getYourDetails,
	postYourDetails
};
