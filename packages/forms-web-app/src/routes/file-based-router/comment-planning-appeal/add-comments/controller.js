/** @type {import('express').RequestHandler} */
const addCommentsGet = (req, res) => {
	if (!req.session.interestedParty?.appealNumber) {
		return res.redirect(`enter-appeal-reference`);
	}

	const interestedParty = req.session.interestedParty || {};

	res.render(`comment-planning-appeal/add-comments/index`, { interestedParty });
};

/** @type {import('express').RequestHandler} */
const addCommentsPost = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [], comments } = body;
	const interestedParty = req.session.interestedParty || {};

	req.session.interestedParty.comments = comments;

	if (Object.keys(errors).length > 0) {
		return res.render(`comment-planning-appeal/add-comments/index`, {
			interestedParty,
			errors,
			errorSummary
		});
	}

	return res.redirect(`check-answers`);
};

module.exports = { addCommentsGet, addCommentsPost };
