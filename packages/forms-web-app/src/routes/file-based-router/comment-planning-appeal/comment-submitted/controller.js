/** @type {import('express').RequestHandler} */
const commentSubmittedGet = (req, res) => {
	if (!req.session.interestedParty?.appealNumber) {
		return res.redirect(`enter-appeal-reference`);
	}

	// if (!req.session.interestedParty?.submitted) {
	// 	return res.redirect(`check-answers`);
	// }

	/** @type {InterestedParty} */
	const interestedParty = req.session.interestedParty;

	res.render(`comment-planning-appeal/comment-submitted/index`, { interestedParty });
};

module.exports = { commentSubmittedGet };
