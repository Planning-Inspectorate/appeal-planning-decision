/** @type {import('express').RequestHandler} */
const enterAppealReferenceGet = (req, res) => {
	res.render(`comment-planning-appeal/enter-appeal-reference/index`);
};

/** @type {import('express').RequestHandler} */
const enterAppealReferencePost = async (req, res) => {
	const { 'appeal-reference': appealReference } = req.body;

	if (!appealReference) {
		return res.render(`comment-planning-appeal/enter-appeal-reference/index`, {
			error: { text: 'Enter the appeal reference', href: '#appeal-reference' },
			value: appealReference
		});
	}

	if (!/^[0-9]{7}$/.exec(appealReference)) {
		return res.render(`comment-planning-appeal/enter-appeal-reference/index`, {
			error: { text: 'Enter the appeal reference using numbers 0 to 9', href: '#appeal-reference' },
			value: appealReference
		});
	}

	if (await req.appealsApiClient.appealCaseRefExists(appealReference)) {
		res.redirect(`/comment-planning-appeal/appeals/${appealReference}`);
		return;
	}

	return res.redirect(`appeal-search-no-results?search=${appealReference}&type=appeal-reference`);
};

module.exports = { enterAppealReferenceGet, enterAppealReferencePost };
