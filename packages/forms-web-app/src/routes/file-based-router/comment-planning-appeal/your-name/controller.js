/**
 * @typedef {import('../check-answers/controller')} InterestedParty
 */

/** @type {import('express').RequestHandler} */
const yourNameGet = (req, res) => {
	if (!req.session.interestedParty?.appealNumber) {
		return res.redirect(`enter-appeal-reference`);
	}
	/** @type {InterestedParty} */
	const interestedParty = req.session.interestedParty;

	res.render(`comment-planning-appeal/your-name/index`, { interestedParty });
};

/** @type {import('express').RequestHandler} */
const yourNamePost = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [], 'first-name': firstName, 'last-name': lastName } = body;

	req.session.interestedParty.firstName = firstName;
	req.session.interestedParty.lastName = lastName;

	if (Object.keys(errors).length > 0) {
		return res.render(`comment-planning-appeal/your-name/index`, {
			interestedParty: req.session.interestedParty,
			errors,
			errorSummary
		});
	}

	return res.redirect(`enter-address`);
};

module.exports = { yourNameGet, yourNamePost };
