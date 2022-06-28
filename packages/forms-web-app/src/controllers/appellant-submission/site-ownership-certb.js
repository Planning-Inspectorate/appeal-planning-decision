const logger = require('../../lib/logger');
const { getNextTask, getTaskStatus } = require('../../services/task.service');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const {
	validSiteOwnershipCertBOptions
} = require('../../validators/appellant-submission/site-ownership-certb');

const sectionName = 'appealSiteSection';
const taskName = 'siteOwnership';

exports.getSiteOwnershipCertB = (req, res) => {
	res.render(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB, {
		appeal: req.session.appeal
	});
};

exports.postSiteOwnershipCertB = async (req, res) => {
	const { body } = req;

	const { errors = {}, errorSummary = [] } = body;

	const { appeal } = req.session;
	const task = appeal[sectionName][taskName];

	let haveOtherOwnersBeenTold = null;
	if (validSiteOwnershipCertBOptions.includes(req.body['have-other-owners-been-told'])) {
		haveOtherOwnersBeenTold = req.body['have-other-owners-been-told'] === 'yes';
	}
	task.haveOtherOwnersBeenTold = haveOtherOwnersBeenTold;

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB, {
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

		res.render(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	res.redirect(getNextTask(appeal, { sectionName, taskName }).href);
};
