const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { AGRICULTURAL_HOLDING, OWN_ALL_THE_LAND, OWN_SOME_OF_THE_LAND }
	}
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealSiteSection';
const taskName = 'siteOwnership';

const getOwnAllTheLand = (req, res) => {
	const { ownsAllTheLand } = req.session.appeal[sectionName][taskName];
	res.render(OWN_ALL_THE_LAND, {
		ownsAllTheLand
	});
};

const postOwnAllTheLand = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] },
		session: { appeal }
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(OWN_ALL_THE_LAND, {
			errors,
			errorSummary
		});
	}

	const ownsAllTheLand = body['own-all-the-land'] === 'yes';
	appeal[sectionName][taskName].ownsAllTheLand = ownsAllTheLand;

	try {
		if (ownsAllTheLand) {
			appeal[sectionName][taskName].advertisingYourAppeal = null;
			appeal[sectionName][taskName].tellingTheLandowners = null;
			appeal[sectionName][taskName].hasIdentifiedTheOwners = null;
			appeal[sectionName][taskName].knowsTheOwners = null;
			appeal[sectionName][taskName].ownsSomeOfTheLand = null;
		}
		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName].ownsAllTheLand = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return ownsAllTheLand
				? res.redirect(`/${AGRICULTURAL_HOLDING}`)
				: res.redirect(`/${OWN_SOME_OF_THE_LAND}`);
		}
		appeal.sectionStates[sectionName].ownsAllTheLand = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);

		return res.render(OWN_ALL_THE_LAND, {
			ownsAllTheLand,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getOwnAllTheLand,
	postOwnAllTheLand
};
