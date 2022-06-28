const {
	VIEW: {
		FULL_APPEAL: { APPEAL_SITE_ADDRESS: currentPage, OWN_ALL_THE_LAND }
	}
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealSiteSection';
const taskName = 'siteAddress';

const getAppealSiteAddress = (req, res) => {
	res.render(currentPage, {
		appeal: req.session.appeal
	});
};

const postAppealSiteAddress = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	req.session.appeal[sectionName][taskName] = {
		addressLine1: req.body['site-address-line-one'],
		addressLine2: req.body['site-address-line-two'],
		town: req.body['site-town-city'],
		county: req.body['site-county'],
		postcode: req.body['site-postcode']
	};

	if (Object.keys(errors).length > 0) {
		return res.render(currentPage, {
			appeal,
			errors,
			errorSummary
		});
	}

	try {
		if (req.body['save-and-return'] !== '') {
			req.session.appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(`/${OWN_ALL_THE_LAND}`);
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

module.exports = {
	getAppealSiteAddress,
	postAppealSiteAddress
};
