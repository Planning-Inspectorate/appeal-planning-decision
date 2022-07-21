const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');

const getEmailAddress = (req, res) => {
	const { email } = req.session.appeal;
	return res.render('appeal-householder-decision/email-address', {
		email
	});
};

const postEmailAddress = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	const {
		appeal,
		appeal: { email }
	} = req.session;

	if (Object.keys(errors).length > 0) {
		return res.render('appeal-householder-decision/email-address', {
			email,
			errors,
			errorSummary
		});
	}

	try {
		appeal.email = body['email-address'];
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (e) {
		logger.error(e);
		return res.render('appeal-householder-decision/email-address', {
			email,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}

	res.redirect('/appeal-householder-decision/confirm-email-address');

};

module.exports = {
	getEmailAddress,
	postEmailAddress
};
