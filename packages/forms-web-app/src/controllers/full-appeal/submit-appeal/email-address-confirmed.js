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

	const appealType =
		typeOfPlanningApplicationToAppealTypeMapper[req.session.appeal.typeOfPlanningApplication];
	const bannerHtmlOverride =
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType));

	let listOfDocumentsUrl = `/${LIST_OF_DOCUMENTS}`;

	switch (appeal.appealType) {
		case APPEAL_ID.PLANNING_SECTION_78:
			if (usingV2Form) {
				listOfDocumentsUrl = '/appeals/full-planning/appeal-form/before-you-start';
			} else {
				listOfDocumentsUrl = `/${LIST_OF_DOCUMENTS}`;
			}
			break;
		case APPEAL_ID.PLANNING_LISTED_BUILDING:
			listOfDocumentsUrl = '/appeals/listed-building/appeal-form/before-you-start';
			break;
		case APPEAL_ID.MINOR_COMMERCIAL:
			listOfDocumentsUrl = '/appeals/cas-planning/appeal-form/before-you-start';
			break;
	}

	res.render(EMAIL_CONFIRMED, {
		listOfDocumentsUrl,
		bannerHtmlOverride
	});
};

module.exports = {
	getEmailConfirmed
};
