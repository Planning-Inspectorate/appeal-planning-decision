const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { ARE_YOU_A_TENANT, OTHER_TENANTS, TELLING_THE_TENANTS }
	}
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealSiteSection';
const taskName = 'agriculturalHolding';

const getAreYouATenant = (req, res) => {
	const { isTenant } = req.session.appeal[sectionName][taskName];
	res.render(ARE_YOU_A_TENANT, {
		isTenant
	});
};

const postAreYouATenant = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] },
		session: { appeal }
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(ARE_YOU_A_TENANT, {
			errors,
			errorSummary
		});
	}

	const isTenant = body['are-you-a-tenant'] === 'yes';
	appeal[sectionName][taskName].isTenant = isTenant;

	try {
		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName].areYouATenant = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return isTenant ? res.redirect(`/${OTHER_TENANTS}`) : res.redirect(`/${TELLING_THE_TENANTS}`);
		}
		appeal.sectionStates[sectionName][taskName].areYouATenant = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);

		return res.render(ARE_YOU_A_TENANT, {
			isTenant,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getAreYouATenant,
	postAreYouATenant
};
