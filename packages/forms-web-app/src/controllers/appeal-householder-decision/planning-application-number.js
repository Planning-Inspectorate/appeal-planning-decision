const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { VIEW } = require('../../lib/views');

const getPlanningApplicationNumber = (req, res) => {
	const { planningApplicationNumber } = req.session.appeal;
	return res.render('appeal-householder-decision/planning-application-number', {
		planningApplicationNumber
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
		return res.render('appeal-householder-decision/planning-application-number', {
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
		return res.render('appeal-householder-decision/planning-application-number', {
			planningApplicationNumber,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}

	return res.redirect('/' + VIEW.APPELLANT_SUBMISSION.EMAIL_ADDRESS);
};

module.exports = {
	getPlanningApplicationNumber,
	postPlanningApplicationNumber
};
