const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');
const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { PRIOR_APPROVAL_EXISTING_HOME }
	}
} = require('../../lib/views');
const config = require('../../config');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');
const { FLAG } = require('@pins/common/src/feature-flags');

const sectionName = 'eligibility';

const getPriorApprovalExistingHome = (req, res) => {
	const {
		appeal: {
			[sectionName]: { hasPriorApprovalForExistingHome }
		}
	} = req.session;
	res.render(PRIOR_APPROVAL_EXISTING_HOME, {
		bannerHtmlOverride: config.betaBannerText,
		hasPriorApprovalForExistingHome
	});
};

const postPriorApprovalExistingHome = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] },
		session: { appeal }
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(PRIOR_APPROVAL_EXISTING_HOME, {
			bannerHtmlOverride: config.betaBannerText,
			errors,
			errorSummary
		});
	}

	const hasPriorApprovalForExistingHome = body['prior-approval-existing-home'] === 'yes';

	try {
		appeal[sectionName].hasPriorApprovalForExistingHome = hasPriorApprovalForExistingHome;
		appeal.appealType = APPEAL_ID.PLANNING_SECTION_78;
		appeal.appealSiteSection.siteOwnership = {
			ownsSomeOfTheLand: null,
			ownsAllTheLand: null,
			knowsTheOwners: null,
			hasIdentifiedTheOwners: null,
			tellingTheLandowners: null,
			advertisingYourAppeal: null
		};
		if (hasPriorApprovalForExistingHome) {
			appeal.appealType = APPEAL_ID.HOUSEHOLDER;
			appeal.appealSiteSection.siteOwnership = {
				ownsWholeSite: null,
				haveOtherOwnersBeenTold: null
			};
		}

		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (err) {
		logger.error(err);

		return res.render(PRIOR_APPROVAL_EXISTING_HOME, {
			bannerHtmlOverride: config.betaBannerText,
			hasPriorApprovalForExistingHome,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}

	if (hasPriorApprovalForExistingHome) {
		return res.redirect('/before-you-start/listed-building-householder');
	}

	const isV2 = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.S78_APPEAL_FORM_V2);

	return isV2
		? res.redirect('/before-you-start/listed-building')
		: res.redirect('/before-you-start/any-of-following');
};

module.exports = {
	getPriorApprovalExistingHome,
	postPriorApprovalExistingHome
};
