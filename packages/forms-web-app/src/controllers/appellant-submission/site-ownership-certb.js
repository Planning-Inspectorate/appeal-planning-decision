const logger = require('../../lib/logger');
const { getNextTask, getTaskStatus } = require('../../services/task.service');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const {
	validSiteOwnershipCertBOptions
} = require('../../validators/appellant-submission/site-ownership-certb');
const { postSaveAndReturn } = require('../appeal-householder-decision/save');

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
		return res.render(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB, {
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

		return res.render(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};
