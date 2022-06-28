const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { getNextTask } = require('../../services/task.service');
const { getTaskStatus } = require('../../services/task.service');

const sectionName = 'appealSiteSection';
const taskName = 'siteAddress';

exports.getSiteLocation = (req, res) => {
	res.render(VIEW.APPELLANT_SUBMISSION.SITE_LOCATION, {
		appeal: req.session.appeal
	});
};

exports.postSiteLocation = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	const { appeal } = req.session;
	const task = appeal[sectionName][taskName];

	task.addressLine1 = req.body['site-address-line-one'];
	task.addressLine2 = req.body['site-address-line-two'];
	task.town = req.body['site-town-city'];
	task.county = req.body['site-county'];
	task.postcode = req.body['site-postcode'];

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.APPELLANT_SUBMISSION.SITE_LOCATION, {
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
		res.render(VIEW.APPELLANT_SUBMISSION.SITE_LOCATION, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	res.redirect(getNextTask(appeal, { sectionName, taskName }).href);
};
