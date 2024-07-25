/**
 * @typedef {import('../check-answers/controller')} InterestedParty
 */

/** @type {import('express').RequestHandler} */
const emailAddressGet = (req, res) => {
	if (!req.session.interestedParty?.appealNumber) {
		return res.redirect(`enter-appeal-reference`);
	}

	/** @type {InterestedParty} */
	const interestedParty = req.session.interestedParty || {};

	res.render(`comment-planning-appeal/email-address/index`, { interestedParty });
};

/** @type {import('express').RequestHandler} */
const emailAddressPost = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [], 'email-address': emailAddress } = body;

	req.session.interestedParty.emailAddress = emailAddress;

	if (Object.keys(errors).length > 0) {
		return res.render(`comment-planning-appeal/email-address/index`, {
			interestedParty: req.session.interestedParty,
			errors,
			errorSummary
		});
	}

	return res.redirect(`add-comments`);
};

module.exports = { emailAddressGet, emailAddressPost };
