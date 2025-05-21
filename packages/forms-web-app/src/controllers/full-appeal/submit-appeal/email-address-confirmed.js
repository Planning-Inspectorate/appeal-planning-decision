const {
	VIEW: {
		FULL_APPEAL: { EMAIL_CONFIRMED, LIST_OF_DOCUMENTS }
	}
} = require('../../../lib/full-appeal/views');
const { FLAG } = require('@pins/common/src/feature-flags');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');
const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const config = require('../../../config');
const {
	typeOfPlanningApplicationToAppealTypeMapper
} = require('#lib/full-appeal/map-planning-application');

const getEmailConfirmed = async (req, res) => {
	const appeal = req.session.appeal;

	const usingV2Form = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.S78_APPEAL_FORM_V2);

	const isS20 = appeal.appealType === APPEAL_ID.PLANNING_LISTED_BUILDING;
	const appealType =
		typeOfPlanningApplicationToAppealTypeMapper[req.session.appeal.typeOfPlanningApplication];
	const bannerHtmlOverride =
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType));

	const listOfDocumentsUrl = isS20
		? '/appeals/listed-building/appeal-form/before-you-start'
		: usingV2Form
			? '/appeals/full-planning/appeal-form/before-you-start'
			: `/${LIST_OF_DOCUMENTS}`;

	res.render(EMAIL_CONFIRMED, {
		listOfDocumentsUrl,
		bannerHtmlOverride
	});
};

module.exports = {
	getEmailConfirmed
};
