/**
 * @typedef {import('../check-answers/controller')} InterestedParty
 */

/** @type {import('express').RequestHandler} */
const enterAddressGet = (req, res) => {
	if (!req.session.interestedParty?.appealNumber) {
		return res.redirect(`enter-appeal-reference`);
	}

	/** @type {InterestedParty} */
	const interestedParty = req.session.interestedParty;

	res.render(`comment-planning-appeal/enter-address/index`, { interestedParty });
};

/** @type {import('express').RequestHandler} */
const enterAddressPost = async (req, res) => {
	const { body } = req;
	const {
		errors = {},
		errorSummary = [],
		addressLine1,
		addressLine2,
		townCity,
		county,
		postcode
	} = body;

	req.session.interestedParty.address = {
		addressLine1,
		addressLine2,
		townCity,
		county,
		postcode
	};

	if (Object.keys(errors).length > 0) {
		return res.render(`comment-planning-appeal/enter-address/index`, {
			interestedParty: req.session.interestedParty,
			errors,
			errorSummary
		});
	}

	return res.redirect(`email-address`);
};

module.exports = { enterAddressGet, enterAddressPost };
