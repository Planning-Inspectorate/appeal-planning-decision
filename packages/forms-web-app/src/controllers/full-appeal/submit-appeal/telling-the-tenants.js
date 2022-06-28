const {
	VIEW: {
		FULL_APPEAL: { TELLING_THE_TENANTS, VISIBLE_FROM_ROAD }
	}
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const toArray = require('../../../lib/to-array');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealSiteSection';
const taskName = 'tellingTheTenants';

const buildVariables = (isTenant, tellingTheTenants) => {
	const isOther = isTenant;
	return {
		tellingTheTenants: toArray(tellingTheTenants),
		isOther,
		backLink: isOther
			? '/full-appeal/submit-appeal/other-tenants'
			: '/full-appeal/submit-appeal/are-you-a-tenant'
	};
};

const getTellingTheTenants = (req, res) => {
	const {
		appeal: {
			appealSiteSection: {
				agriculturalHolding: { tellingTheTenants, isTenant }
			}
		}
	} = req.session;

	res.render(TELLING_THE_TENANTS, buildVariables(isTenant, tellingTheTenants));
};

const postTellingTheTenants = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] },
		session: {
			appeal,
			appeal: {
				appealSiteSection: {
					agriculturalHolding: { isTenant }
				}
			}
		}
	} = req;

	const tellingTheTenants = toArray(body['telling-the-tenants']);
	if (Object.keys(errors).length > 0) {
		return res.render(TELLING_THE_TENANTS, {
			...buildVariables(isTenant, tellingTheTenants),
			errors,
			errorSummary
		});
	}

	appeal.appealSiteSection.agriculturalHolding.tellingTheTenants = tellingTheTenants;
	try {
		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(`/${VISIBLE_FROM_ROAD}`);
		}
		appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);

		return res.render(TELLING_THE_TENANTS, {
			...buildVariables(isTenant, tellingTheTenants),
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getTellingTheTenants,
	postTellingTheTenants
};
