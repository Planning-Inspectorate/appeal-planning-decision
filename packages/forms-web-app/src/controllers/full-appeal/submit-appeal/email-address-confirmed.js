const {
	VIEW: {
		FULL_APPEAL: { EMAIL_CONFIRMED }
	}
} = require('../../../lib/full-appeal/views');
const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const config = require('../../../config');
const { caseTypeLookup } = require('@pins/common/src/database/data-static');

const getEmailConfirmed = async (req, res) => {
	const appeal = req.session.appeal;

	const appealType = caseTypeLookup(appeal.appealType, 'id')?.processCode;
	const bannerHtmlOverride =
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType));

	let listOfDocumentsUrl = '';

	switch (appeal.appealType) {
		case APPEAL_ID.PLANNING_SECTION_78:
			listOfDocumentsUrl = '/appeals/full-planning/appeal-form/before-you-start';
			break;
		case APPEAL_ID.PLANNING_LISTED_BUILDING:
			listOfDocumentsUrl = '/appeals/listed-building/appeal-form/before-you-start';
			break;
		case APPEAL_ID.MINOR_COMMERCIAL:
			listOfDocumentsUrl = '/appeals/cas-planning/appeal-form/before-you-start';
			break;
		case APPEAL_ID.ADVERTISEMENT:
		case APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT:
			listOfDocumentsUrl = '/appeals/adverts/appeal-form/before-you-start';
			break;
		case APPEAL_ID.ENFORCEMENT_NOTICE:
			listOfDocumentsUrl = '/appeals/enforcement/appeal-form/before-you-start';
			break;
		default:
			throw new Error(`Unknown appeal type: ${appeal.appealType}`);
	}

	res.render(EMAIL_CONFIRMED, {
		listOfDocumentsUrl,
		bannerHtmlOverride
	});
};

module.exports = {
	getEmailConfirmed
};
