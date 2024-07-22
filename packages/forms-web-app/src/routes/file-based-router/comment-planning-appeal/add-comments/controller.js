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
	const { comments } = req.body;

	req.session.interestedParty.comments = comments;

	return res.redirect(`comment-planning-appeal/check-answers/index`);
};

module.exports = { addCommentsGet, addCommentsPost };
