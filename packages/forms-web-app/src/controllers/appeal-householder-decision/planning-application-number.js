const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const backLink = '/before-you-start/can-use-service';

const getPlanningApplicationNumber = (req, res) => {
	const { planningApplicationNumber } = req.session.appeal;
	return res.render('appeal-householder-decision/planning-application-number', {
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
		return res.render('appeal-householder-decision/planning-application-number', {
			planningApplicationNumber,
			backLink,
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
			backLink,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}

	return res.redirect('/appeal-householder-decision/email-address');
};

module.exports = {
	getPlanningApplicationNumber,
	postPlanningApplicationNumber
};
