const {
	constants: { APPLICATION_DECISION }
} = require('@pins/business-rules');
const logger = require('../../lib/logger');
const {
	VIEW: {
		FULL_APPEAL: { GRANTED_OR_REFUSED: currentPage }
	}
} = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	validApplicationDecisionOptions
} = require('../../validators/full-appeal/granted-or-refused');
const config = require('../../config');
const {
	typeOfPlanningApplicationToAppealTypeMapper
} = require('#lib/full-appeal/map-planning-application');

exports.forwardPage = (status) => {
	const statuses = {
		[APPLICATION_DECISION.GRANTED]: '/before-you-start/decision-date',
		[APPLICATION_DECISION.NODECISIONRECEIVED]: '/before-you-start/date-decision-due',
		[APPLICATION_DECISION.REFUSED]: '/before-you-start/decision-date',

		default: currentPage
	};

	return statuses[status] || statuses.default;
};

exports.getGrantedOrRefused = async (req, res) => {
	const { appeal } = req.session;
	const appealType = typeOfPlanningApplicationToAppealTypeMapper[appeal.typeOfPlanningApplication];
	res.render(currentPage, {
		appeal,
		bannerHtmlOverride:
			config.betaBannerText +
			config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
	});
};

exports.postGrantedOrRefused = async (req, res) => {
	const { body } = req;
	const { appeal } = req.session;
	const { errors = {}, errorSummary = [] } = body;

	const applicationDecision = body['granted-or-refused'];
	let selectedApplicationStatus = null;

	if (validApplicationDecisionOptions.includes(applicationDecision)) {
		selectedApplicationStatus = applicationDecision;
		appeal.eligibility.applicationDecision = selectedApplicationStatus.toUpperCase();
	}

	appeal.eligibility.applicationDecision = selectedApplicationStatus;
	const appealType = typeOfPlanningApplicationToAppealTypeMapper[appeal.typeOfPlanningApplication];

	if (Object.keys(errors).length > 0) {
		res.render(currentPage, {
			appeal,
			errors,
			errorSummary,
			bannerHtmlOverride:
				config.betaBannerText +
				config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
		});
		return;
	}

	try {
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);

		res.render(currentPage, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }],
			bannerHtmlOverride:
				config.betaBannerText +
				config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType))
		});
		return;
	}

	res.redirect(`${this.forwardPage(selectedApplicationStatus)}`);
};
