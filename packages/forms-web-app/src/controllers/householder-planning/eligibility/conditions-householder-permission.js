const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');
const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { CONDITIONS_HOUSEHOLDER_PERMISSION }
		}
	}
} = require('../../../lib/views');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');
const { FLAG } = require('@pins/common/src/feature-flags');
const config = require('../../../config');

const sectionName = 'eligibility';

const getConditionsHouseholderPermission = (req, res) => {
	const {
		appeal: {
			[sectionName]: { hasHouseholderPermissionConditions }
		}
	} = req.session;
	res.render(CONDITIONS_HOUSEHOLDER_PERMISSION, {
		hasHouseholderPermissionConditions,
		bannerHtmlOverride:
			config.betaBannerText +
			config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('HAS'))
	});
};

const postConditionsHouseholderPermission = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] },
		session: { appeal }
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(CONDITIONS_HOUSEHOLDER_PERMISSION, {
			errors,
			errorSummary,
			bannerHtmlOverride:
				config.betaBannerText +
				config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('HAS'))
		});
	}

	const hasHouseholderPermissionConditions = body['conditions-householder-permission'] === 'yes';

	try {
		appeal[sectionName].hasHouseholderPermissionConditions = hasHouseholderPermissionConditions;
		if (hasHouseholderPermissionConditions) {
			appeal.appealType = APPEAL_ID.HOUSEHOLDER;
			appeal.appealSiteSection.siteOwnership = {
				ownsWholeSite: null,
				haveOtherOwnersBeenTold: null
			};
		} else {
			appeal.appealType = APPEAL_ID.PLANNING_SECTION_78;
			appeal.appealSiteSection.siteOwnership = {
				ownsSomeOfTheLand: null,
				ownsAllTheLand: null,
				knowsTheOwners: null,
				hasIdentifiedTheOwners: null,
				tellingTheLandowners: null,
				advertisingYourAppeal: null
			};
		}
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (err) {
		logger.error(err);

		return res.render(CONDITIONS_HOUSEHOLDER_PERMISSION, {
			hasHouseholderPermissionConditions,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }],
			bannerHtmlOverride:
				config.betaBannerText +
				config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('HAS'))
		});
	}

	if (hasHouseholderPermissionConditions) {
		return res.redirect('/before-you-start/listed-building-householder');
	}

	const isV2 = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.S78_APPEAL_FORM_V2);

	return isV2
		? res.redirect('/before-you-start/listed-building')
		: res.redirect('/before-you-start/any-of-following');
};

module.exports = {
	getConditionsHouseholderPermission,
	postConditionsHouseholderPermission
};
