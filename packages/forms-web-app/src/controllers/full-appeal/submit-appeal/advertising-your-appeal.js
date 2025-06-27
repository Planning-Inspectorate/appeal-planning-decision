const { KNOW_THE_OWNERS } = require('@pins/business-rules/src/constants');
const {
	VIEW: {
		FULL_APPEAL: { ADVERTISING_YOUR_APPEAL, TELLING_THE_LANDOWNERS, AGRICULTURAL_HOLDING }
	}
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const toArray = require('../../../lib/to-array');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealSiteSection';
const taskName = 'advertisingYourAppeal';

const buildVariables = (ownsSomeOfTheLand, knowsTheOwners, advertisingYourAppeal) => {
	const isOther = ownsSomeOfTheLand;
	const isAll = knowsTheOwners === KNOW_THE_OWNERS.SOME;
	return {
		advertisingYourAppeal: toArray(advertisingYourAppeal),
		isOther,
		isAll
	};
};

const getAdvertisingYourAppeal = (req, res) => {
	const {
		appeal: {
			appealSiteSection: {
				siteOwnership: { ownsSomeOfTheLand, knowsTheOwners, advertisingYourAppeal }
			}
		}
	} = req.session;

	res.render(
		ADVERTISING_YOUR_APPEAL,
		buildVariables(ownsSomeOfTheLand, knowsTheOwners, advertisingYourAppeal)
	);
};

const postAdvertisingYourAppeal = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] },
		session: {
			appeal,
			appeal: {
				appealSiteSection: {
					siteOwnership: { ownsSomeOfTheLand, knowsTheOwners }
				}
			}
		}
	} = req;

	const advertisingYourAppeal = toArray(body['advertising-your-appeal']);
	const variables = buildVariables(ownsSomeOfTheLand, knowsTheOwners, advertisingYourAppeal);
	if (Object.keys(errors).length > 0) {
		return res.render(ADVERTISING_YOUR_APPEAL, {
			...variables,
			errors,
			errorSummary
		});
	}

	try {
		appeal.appealSiteSection.siteOwnership.advertisingYourAppeal = advertisingYourAppeal;
		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			const nextPage = variables.isAll ? `/${TELLING_THE_LANDOWNERS}` : `/${AGRICULTURAL_HOLDING}`;
			return res.redirect(nextPage);
		}
		appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);

		return res.render(ADVERTISING_YOUR_APPEAL, {
			...variables,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getAdvertisingYourAppeal,
	postAdvertisingYourAppeal
};
