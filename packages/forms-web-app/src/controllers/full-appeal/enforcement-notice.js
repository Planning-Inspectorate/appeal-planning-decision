const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { ENFORCEMENT_NOTICE: currentPage }
	}
} = require('../../lib/views');
const {
	validEnforcementNoticeOptions
} = require('../../validators/full-appeal/enforcement-notice');

const navigationPages = {
	nextPage: '/before-you-start/can-use-service',
	shutterPage: '/before-you-start/use-existing-service-enforcement-notice'
};
const config = require('../../config');

exports.getEnforcementNotice = (req, res) => {
	const { appeal } = req.session;
	res.render(currentPage, {
		bannerHtmlOverride: config.betaBannerText,
		appeal
	});
};

exports.postEnforcementNotice = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	let hasReceivedEnforcementNotice = null;
	if (validEnforcementNoticeOptions.includes(req.body['enforcement-notice'])) {
		hasReceivedEnforcementNotice = req.body['enforcement-notice'] === 'yes';
	}

	if (Object.keys(errors).length > 0) {
		res.render(currentPage, {
			bannerHtmlOverride: config.betaBannerText,
			appeal: {
				...appeal,
				eligibility: {
					...appeal.eligibility,
					enforcementNotice: hasReceivedEnforcementNotice
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
				enforcementNotice: hasReceivedEnforcementNotice
			}
		});
	} catch (e) {
		logger.error(e);

		res.render(currentPage, {
			bannerHtmlOverride: config.betaBannerText,
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	if (hasReceivedEnforcementNotice) {
		res.redirect(navigationPages.shutterPage);
		return;
	}

	res.redirect(navigationPages.nextPage);
};
