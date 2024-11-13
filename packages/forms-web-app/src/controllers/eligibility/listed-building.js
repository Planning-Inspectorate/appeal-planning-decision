const { VIEW } = require('../../lib/views');
const { validIsListedBuildingOptions } = require('../../validators/eligibility/listed-building');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const config = require('../../config');

exports.getServiceNotAvailableForListedBuildings = (req, res) => {
	res.render(VIEW.ELIGIBILITY.LISTED_OUT, { bannerHtmlOverride: config.betaBannerText });
};

exports.getListedBuilding = (req, res) => {
	res.render(VIEW.ELIGIBILITY.LISTED_BUILDING, {
		bannerHtmlOverride: config.betaBannerText,
		appeal: req.session.appeal
	});
};

exports.postListedBuilding = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	const { appeal } = req.session;

	let isAppealAboutAListedBuilding = null;
	if (validIsListedBuildingOptions.includes(req.body['is-your-appeal-about-a-listed-building'])) {
		isAppealAboutAListedBuilding = req.body['is-your-appeal-about-a-listed-building'] === 'yes';
	}

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.ELIGIBILITY.LISTED_BUILDING, {
			bannerHtmlOverride: config.betaBannerText,
			appeal: {
				...appeal,
				eligibility: {
					...appeal.eligibility,
					isListedBuilding: isAppealAboutAListedBuilding
				}
			},
			errors,
			errorSummary
		});
		return;
	}

	try {
		req.session.appeal = await createOrUpdateAppeal({
			...appeal,
			eligibility: {
				...appeal.eligibility,
				isListedBuilding: isAppealAboutAListedBuilding
			}
		});
	} catch (e) {
		req.log.error(e);

		res.render(VIEW.ELIGIBILITY.LISTED_BUILDING, {
			bannerHtmlOverride: config.betaBannerText,
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	if (isAppealAboutAListedBuilding) {
		res.redirect(`/${VIEW.BEFORE_YOU_START.USE_EXISTING_SERVICE_LISTED_BUILDING}`);
		return;
	}

	res.redirect(`/${VIEW.ELIGIBILITY.COSTS}`);
};
