const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const { validCostsOptions } = require('../../validators/eligibility/costs');
const config = require('../../config');

exports.getCostsOut = (req, res) => {
	res.render(VIEW.ELIGIBILITY.COSTS_OUT, { bannerHtmlOverride: config.betaBannerText });
};

exports.getCosts = (req, res) => {
	res.render(VIEW.ELIGIBILITY.COSTS, {
		bannerHtmlOverride: config.betaBannerText,
		appeal: req.session.appeal
	});
};

exports.postCosts = async (req, res) => {
	const { body } = req;

	const { errors = {}, errorSummary = [] } = body;

	const { appeal } = req.session;

	let isClaimingCosts = null;
	if (validCostsOptions.includes(req.body['claim-costs'])) {
		isClaimingCosts = req.body['claim-costs'] === 'yes';
	}

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.ELIGIBILITY.COSTS, {
			bannerHtmlOverride: config.betaBannerText,
			appeal,
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
				isClaimingCosts
			}
		});
	} catch (e) {
		logger.error(e);

		res.render(VIEW.ELIGIBILITY.COSTS, {
			bannerHtmlOverride: config.betaBannerText,
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	if (isClaimingCosts) {
		res.redirect(`/${VIEW.ELIGIBILITY.COSTS_OUT}`);
		return;
	}

	res.redirect(`/${VIEW.ELIGIBILITY.APPEAL_STATEMENT}`);
};
