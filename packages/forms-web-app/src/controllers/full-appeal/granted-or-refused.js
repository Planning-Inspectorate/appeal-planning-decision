const {
	constants: { APPLICATION_DECISION, TYPE_OF_PLANNING_APPLICATION, APPEAL_ID }
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
	res.render(currentPage, {
		appeal
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

	if (Object.keys(errors).length > 0) {
		res.render(currentPage, {
			appeal,
			errors,
			errorSummary
		});
		return;
	}

	if (appeal.typeOfPlanningApplication == TYPE_OF_PLANNING_APPLICATION.ADVERTISEMENT) {
		appeal.appealType =
			applicationDecision == APPLICATION_DECISION.REFUSED
				? (appeal.appealType = APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT)
				: (appeal.appealType = APPEAL_ID.ADVERTISEMENT);
	}
	if (
		appeal.typeOfPlanningApplication == TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT
	) {
		appeal.appealType =
			applicationDecision == APPLICATION_DECISION.REFUSED
				? appeal.appealType // leave as current appeal type (either CAS planning or S78 based on planning application about answer)
				: (appeal.appealType = APPEAL_ID.PLANNING_SECTION_78);
	}

	try {
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);

		res.render(currentPage, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	res.redirect(`${this.forwardPage(selectedApplicationStatus)}`);
};
