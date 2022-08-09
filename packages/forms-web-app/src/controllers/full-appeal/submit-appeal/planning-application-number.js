const {
	VIEW: {
		FULL_APPEAL: { PLANNING_APPLICATION_NUMBER, EMAIL_ADDRESS }
	}
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');

exports.getPlanningApplicationNumber = (req, res) => {
	const { planningApplicationNumber } = req.session.appeal;
	res.render(PLANNING_APPLICATION_NUMBER, {
		planningApplicationNumber
	});
};

exports.postPlanningApplicationNumber = async (req, res) => {
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
		res.render(PLANNING_APPLICATION_NUMBER, {
			planningApplicationNumber,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	res.redirect(`/${EMAIL_ADDRESS}`);
};
