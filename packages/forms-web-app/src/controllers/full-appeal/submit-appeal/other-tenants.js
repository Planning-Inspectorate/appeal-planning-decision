const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { OTHER_TENANTS, TELLING_THE_TENANTS, VISIBLE_FROM_ROAD }
	}
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealSiteSection';
const taskName = 'agriculturalHolding';

const getOtherTenants = (req, res) => {
	const { hasOtherTenants } = req.session.appeal[sectionName][taskName];
	res.render(OTHER_TENANTS, {
		hasOtherTenants
	});
};

const postOtherTenants = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] },
		session: { appeal }
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(OTHER_TENANTS, {
			errors,
			errorSummary
		});
	}

	const hasOtherTenants = body['other-tenants'] === 'yes';
	appeal[sectionName][taskName].hasOtherTenants = hasOtherTenants;

	try {
		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName].otherTenants = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return hasOtherTenants
				? res.redirect(`/${TELLING_THE_TENANTS}`)
				: res.redirect(`/${VISIBLE_FROM_ROAD}`);
		}
		req.session.appeal.sectionStates[sectionName].otherTenants = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);

		return res.render(OTHER_TENANTS, {
			hasOtherTenants,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getOtherTenants,
	postOtherTenants
};
