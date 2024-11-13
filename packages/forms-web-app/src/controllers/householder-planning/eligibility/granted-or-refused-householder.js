const {
	constants: { APPEAL_ID, APPLICATION_DECISION }
} = require('@pins/business-rules');
const logger = require('../../../lib/logger');
const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { GRANTED_OR_REFUSED_HOUSEHOLDER }
		}
	}
} = require('../../../lib/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const config = require('../../../config');

const getGrantedOrRefusedHouseholder = async (req, res) => {
	res.render(GRANTED_OR_REFUSED_HOUSEHOLDER, {
		bannerHtmlOverride: config.betaBannerText,
		appeal: req.session.appeal
	});
};

const postGrantedOrRefusedHouseholder = async (req, res) => {
	const { body } = req;
	const { appeal } = req.session;
	const { errors = {}, errorSummary = [] } = body;

	const applicationDecision = body['granted-or-refused'];

	if (Object.keys(errors).length > 0) {
		return res.render(GRANTED_OR_REFUSED_HOUSEHOLDER, {
			bannerHtmlOverride: config.betaBannerText,
			appeal,
			errors,
			errorSummary
		});
	}

	try {
		appeal.eligibility.applicationDecision = applicationDecision;
		appeal.appealType =
			applicationDecision === APPLICATION_DECISION.REFUSED
				? APPEAL_ID.HOUSEHOLDER
				: APPEAL_ID.PLANNING_SECTION_78;
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (err) {
		logger.error(err);

		return res.render(GRANTED_OR_REFUSED_HOUSEHOLDER, {
			bannerHtmlOverride: config.betaBannerText,
			appeal,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}

	switch (applicationDecision) {
		case APPLICATION_DECISION.GRANTED:
			return res.redirect('/before-you-start/decision-date');
		case APPLICATION_DECISION.REFUSED:
			return res.redirect('/before-you-start/decision-date-householder');
		default:
			return res.redirect('/before-you-start/date-decision-due');
	}
};

module.exports = {
	getGrantedOrRefusedHouseholder,
	postGrantedOrRefusedHouseholder
};
