const logger = require('../../lib/logger');
const { getNextTask } = require('../../services/task.service');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const { getTaskStatus } = require('../../services/task.service');
const { validSiteAccessOptions } = require('../../validators/appellant-submission/site-access');

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
		res.render(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS, {
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

		res.render(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	res.redirect(getNextTask(appeal, { sectionName, taskName }).href);
};
