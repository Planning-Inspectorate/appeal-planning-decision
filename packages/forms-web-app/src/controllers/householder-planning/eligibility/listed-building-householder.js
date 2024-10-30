const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { LISTED_BUILDING_HOUSEHOLDER }
		}
	}
} = require('../../../lib/views');
const config = require('../../../config');

const sectionName = 'eligibility';

const getListedBuildingHouseholder = async (req, res) => {
	let {
		[sectionName]: { isListedBuilding }
	} = req.session.appeal;
	//todo: is typeOfPlanningApplication used in nunjucks page?

	// The statement below is a workaround that populates the radio button
	// as false if the appeal type is full planning (1005) - this is because
	// the appeal object for full planning does not include an eligibility.isListedBuilding
	// field and, at the moment, the logic of the user journey means that if the user is
	// able to navigate back to this page after the appeal type has been set as full planning,
	// the user will have answered 'false' on this page
	if (req.session.appeal.appealType == 1005) {
		isListedBuilding = false;
	}

	res.render(LISTED_BUILDING_HOUSEHOLDER, {
		bannerHtmlOverride: config.betaBannerText,
		isListedBuilding
	});
};

const postListedBuildingHouseholder = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const {
		appeal,
		appeal: { typeOfPlanningApplication }
	} = req.session;

	let isListedBuilding = null;

	if (body['listed-building-householder'] === 'yes') {
		isListedBuilding = true;
	} else if (body['listed-building-householder'] === 'no') {
		isListedBuilding = false;
	}

	if (Object.keys(errors).length > 0) {
		return res.render(LISTED_BUILDING_HOUSEHOLDER, {
			bannerHtmlOverride: config.betaBannerText,
			isListedBuilding,
			typeOfPlanningApplication,
			errors,
			errorSummary
		});
	}

	try {
		appeal[sectionName].isListedBuilding = isListedBuilding;
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (err) {
		logger.error(err);

		return res.render(LISTED_BUILDING_HOUSEHOLDER, {
			bannerHtmlOverride: config.betaBannerText,
			isListedBuilding,
			typeOfPlanningApplication,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}

	return isListedBuilding
		? res.redirect(`/before-you-start/use-existing-service-listed-building`)
		: res.redirect(`/before-you-start/granted-or-refused-householder`);
};

module.exports = {
	getListedBuildingHouseholder,
	postListedBuildingHouseholder
};
