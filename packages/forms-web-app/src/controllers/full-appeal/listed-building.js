const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { LISTED_BUILDING }
	}
} = require('../../lib/views');
const config = require('../../config');
const { FLAG } = require('@pins/common/src/feature-flags');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');
const { APPEAL_ID } = require('@pins/business-rules/src/constants');

const sectionName = 'eligibility';

const getListedBuilding = async (req, res) => {
	let {
		[sectionName]: { isListedBuilding }
	} = req.session.appeal;

	const isV2 = await isLpaInFeatureFlag(req.session.appeal.lpaCode, FLAG.S78_APPEAL_FORM_V2);

	if (!isV2) {
		// The statement below is a workaround that populates the radio button
		// as false if the appeal type is v1 full planning (1005 / s78) - this is because
		// the v1 s78 journey does not populate the eligibility.isListedBuilding
		// field and, at the moment, the logic of the user journey means that if the user is
		// able to navigate back to this page after the appeal type has been set as full planning,
		// the user will have implicitly answered 'false' on this page
		if (req.session.appeal.appealType === APPEAL_ID.PLANNING_SECTION_78) {
			isListedBuilding = false;
		}
	}

	res.render(LISTED_BUILDING, {
		bannerHtmlOverride: config.betaBannerText,
		isListedBuilding
	});
};

const postListedBuilding = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	let isListedBuilding = null;

	if (body['listed-building'] === 'yes') {
		isListedBuilding = true;
	} else if (body['listed-building'] === 'no') {
		isListedBuilding = false;
	}

	if (Object.keys(errors).length > 0) {
		return res.render(LISTED_BUILDING, {
			bannerHtmlOverride: config.betaBannerText,
			isListedBuilding,
			errors,
			errorSummary
		});
	}

	const isV2forS20 = await isLpaInFeatureFlag(appeal.lpaCode, FLAG.S20_APPEAL_FORM_V2);

	if (isV2forS20) {
		appeal.appealType = isListedBuilding
			? APPEAL_ID.PLANNING_LISTED_BUILDING
			: appeal.eligibility.hasHouseholderPermissionConditions
			? APPEAL_ID.HOUSEHOLDER
			: APPEAL_ID.PLANNING_SECTION_78;
	}

	try {
		appeal[sectionName].isListedBuilding = isListedBuilding;
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (err) {
		logger.error(err);

		return res.render(LISTED_BUILDING, {
			bannerHtmlOverride: config.betaBannerText,
			isListedBuilding,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}

	if (isListedBuilding && !isV2forS20) {
		return res.redirect(`/before-you-start/use-existing-service-listed-building`);
	}

	return appeal.appealType === APPEAL_ID.HOUSEHOLDER
		? res.redirect(`/before-you-start/granted-or-refused-householder`)
		: res.redirect('/before-you-start/granted-or-refused');
};

module.exports = {
	getListedBuilding,
	postListedBuilding
};
