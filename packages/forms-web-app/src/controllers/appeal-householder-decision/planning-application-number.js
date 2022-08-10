const {
	VIEW: { EMAIL_ADDRESS, PLANNING_APPLICATION_NUMBER }
} = require('../../lib/views');

const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');

const getPlanningApplicationNumber = (req, res) => {
	const { planningApplicationNumber, typeOfPlanningApplication } = req.session.appeal;

	return res.render(PLANNING_APPLICATION_NUMBER, {
		typeOfPlanningApplication,
		planningApplicationNumber,
		backLink
	});
};

const postPlanningApplicationNumber = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	const {
		appeal,
		appeal: { planningApplicationNumber }
	} = req.session;

	if (Object.keys(errors).length > 0) {
		return res.render(PLANNING_APPLICATION_NUMBER, {
			planningApplicationNumber,
			errors,
			errorSummary
		});
	}

	try {
		appeal.planningApplicationNumber = body['application-number'];
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);
		return res.render(PLANNING_APPLICATION_NUMBER, {
			planningApplicationNumber,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}

	return res.redirect(`${EMAIL_ADDRESS}`);
};

module.exports = {
	getPlanningApplicationNumber,
	postPlanningApplicationNumber
};
