const {
	VIEW: {
		FULL_APPEAL: { ANY_OF_FOLLOWING }
	}
} = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const config = require('../../config');
const { FLAG } = require('@pins/common/src/feature-flags');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

const sectionName = 'eligibility';

// this controller only used for v1 appeals

const getAnyOfFollowing = async (req, res) => {
	// redirect if v2
	const isV2 = await isLpaInFeatureFlag(req.session.appeal.lpaCode, FLAG.S78_APPEAL_FORM_V2);
	if (isV2) return res.redirect(config.appeals.startingPointEnrolUsersActive);

	const {
		[sectionName]: { applicationCategories },
		typeOfPlanningApplication
	} = req.session.appeal;

	res.render(ANY_OF_FOLLOWING, {
		bannerHtmlOverride: config.betaBannerText,
		applicationCategories,
		typeOfPlanningApplication
	});
};

const postAnyOfFollowing = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const {
		appeal,
		appeal: { typeOfPlanningApplication }
	} = req.session;

	const applicationCategories = body['any-of-following'];

	if (Object.keys(errors).length > 0) {
		return res.render(ANY_OF_FOLLOWING, {
			bannerHtmlOverride: config.betaBannerText,
			applicationCategories,
			typeOfPlanningApplication,
			errors,
			errorSummary
		});
	}

	try {
		appeal[sectionName].applicationCategories = Array.isArray(applicationCategories)
			? applicationCategories
			: [applicationCategories];
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (err) {
		logger.error(err);

		return res.render(ANY_OF_FOLLOWING, {
			bannerHtmlOverride: config.betaBannerText,
			applicationCategories,
			typeOfPlanningApplication,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}

	return applicationCategories.includes('none_of_these')
		? res.redirect('/before-you-start/granted-or-refused')
		: res.redirect('/before-you-start/use-existing-service-development-type');
};

module.exports = {
	getAnyOfFollowing,
	postAnyOfFollowing
};
