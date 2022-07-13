const logger = require('../../lib/logger');
const { getNextTask } = require('../../services/task.service');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const { getTaskStatus } = require('../../services/task.service');
const { validSiteAccessOptions } = require('../../validators/appellant-submission/site-access');
const { postSaveAndReturn } = require('../appeal-householder-decision/save');

const sectionName = 'appealSiteSection';
const taskName = 'siteAccess';

exports.getSiteAccess = (req, res) => {
	res.render(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS, {
		appeal: req.session.appeal
	});
};

exports.postSiteAccess = async (req, res) => {
	const { body } = req;

	const { errors = {}, errorSummary = [] } = body;

	const { appeal } = req.session;
	const task = appeal[sectionName][taskName];

	let canInspectorSeeWholeSiteFromPublicRoad = null;
	if (validSiteAccessOptions.includes(req.body['site-access'])) {
		canInspectorSeeWholeSiteFromPublicRoad = req.body['site-access'] === 'yes';
	}
	task.canInspectorSeeWholeSiteFromPublicRoad = canInspectorSeeWholeSiteFromPublicRoad;

	let howIsSiteAccessRestricted = null;
	if (canInspectorSeeWholeSiteFromPublicRoad === false) {
		howIsSiteAccessRestricted = req.body['site-access-more-detail'];
	}
	task.howIsSiteAccessRestricted = howIsSiteAccessRestricted;

	if (Object.keys(errors).length > 0) {
		return res.render(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS, {
			appeal,
			errors,
			errorSummary
		});
	}

	try {
		appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
		if (req.body['save-and-return'] !== '') {
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(getNextTask(appeal, { sectionName, taskName }).href);
		}
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (e) {
		logger.error(e);

		return res.render(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};
