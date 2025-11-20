const {
	VIEW: {
		FULL_APPEAL: { EMAIL_CONFIRMED, LIST_OF_DOCUMENTS_V1 }
	}
} = require('../../../lib/full-appeal/views');
const { FLAG } = require('@pins/common/src/feature-flags');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');
const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const config = require('../../../config');
const { hideFromDashboard } = require('#lib/hide-from-dashboard');
const { caseTypeLookup } = require('@pins/common/src/database/data-static');

const getEmailConfirmed = async (req, res) => {
	const appeal = req.session.appeal;

	const usingV2Form = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.S78_APPEAL_FORM_V2);

	const appealType = caseTypeLookup(appeal.appealType, 'id')?.processCode;
	const bannerHtmlOverride =
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType));

	let listOfDocumentsUrl = `/${LIST_OF_DOCUMENTS_V1}`;

	switch (appeal.appealType) {
		case APPEAL_ID.PLANNING_SECTION_78:
			if (usingV2Form) {
				await hideFromDashboard(req, appeal);
				listOfDocumentsUrl = '/appeals/full-planning/appeal-form/before-you-start';
			} else {
				listOfDocumentsUrl = `/${LIST_OF_DOCUMENTS_V1}`;
			}
			break;
		case APPEAL_ID.PLANNING_LISTED_BUILDING:
			await hideFromDashboard(req, appeal);
			listOfDocumentsUrl = '/appeals/listed-building/appeal-form/before-you-start';
			break;
		case APPEAL_ID.MINOR_COMMERCIAL:
			await hideFromDashboard(req, appeal);
			listOfDocumentsUrl = '/appeals/cas-planning/appeal-form/before-you-start';
			break;
		case APPEAL_ID.ADVERTISEMENT:
		case APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT:
			await hideFromDashboard(req, appeal);
			listOfDocumentsUrl = '/appeals/adverts/appeal-form/before-you-start';
			break;
		case APPEAL_ID.ENFORCEMENT_NOTICE:
			await hideFromDashboard(req, appeal);
			listOfDocumentsUrl = '/appeals/enforcement/appeal-form/before-you-start';
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
