/** @type {import('express').RequestHandler} */
const yourNameGet = (req, res) => {
	if (!req.session.interestedParty?.appealNumber) {
		return res.redirect(`enter-appeal-reference`);
	}

	const interestedParty = req.session.interestedParty || {};

	res.render(`comment-planning-appeal/your-name/index`, { interestedParty });
};

/** @type {import('express').RequestHandler} */
const yourNamePost = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [], 'first-name': firstName, 'last-name': lastName } = body;
	const interestedParty = req.session.interestedParty || {};

	if (Object.keys(errors).length > 0) {
		return res.render(`comment-planning-appeal/your-name/index`, {
			interestedParty,
			errors,
			errorSummary
		});
	}

	req.session.interestedParty.firstName = firstName;
	req.session.interestedParty.lastName = lastName;

	return res.redirect(`email-address`);
};

module.exports = { yourNameGet, yourNamePost };
