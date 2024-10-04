const logger = require('../../lib/logger');
const { getNextTask } = require('../../services/task.service');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const { getTaskStatus } = require('../../services/task.service');
const {
	validSiteAccessSafetyOptions
} = require('../../validators/appellant-submission/site-access-safety');
const { postSaveAndReturn } = require('../appeal-householder-decision/save');

const sectionName = 'appealSiteSection';
const taskName = 'healthAndSafety';

exports.getSiteAccessSafety = (req, res) => {
	res.render(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY, {
		appeal: req.session.appeal
	});
};

exports.postSiteAccessSafety = async (req, res) => {
	const { body } = req;

	const { errors = {}, errorSummary = [] } = body;

	const { appeal } = req.session;
	const task = appeal[sectionName][taskName];

	let hasIssues = null;
	if (validSiteAccessSafetyOptions.includes(req.body['site-access-safety'])) {
		hasIssues = req.body['site-access-safety'] === 'yes';
	}
	task.hasIssues = hasIssues;

	task.healthAndSafetyIssues =
		typeof req.body['site-access-safety-concerns'] !== 'undefined'
			? req.body['site-access-safety-concerns']
			: null;

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY, {
			appeal,
			errors,
			errorSummary
		});
		return;
	}

	try {
		if (!task.hasIssues) {
			task.healthAndSafetyIssues = '';
		}
		appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
		if (req.body['save-and-return'] !== '') {
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(getNextTask(appeal, { sectionName, taskName }).href);
		}
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (e) {
		logger.error(e);

		res.render(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};
