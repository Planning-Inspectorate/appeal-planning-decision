/** @type {import('express').RequestHandler} */
const enterAppealReferenceGet = (req, res) => {
	res.render(`enter-appeal-reference/index`);
};

/** @type {import('express').RequestHandler} */
const enterAppealReferencePost = (req, res) => {
	const { 'appeal-reference': appealReference } = req.body;

	if (!appealReference) {
		return res.render(`enter-appeal-reference/index`, {
			inlineErrorMessage: { text: 'Enter the appeal reference' },
			value: appealReference
		});
	}

	if (!/^[0-9]{7}$/.exec(appealReference)) {
		return res.render(`enter-appeal-reference/index`, {
			inlineErrorMessage: { text: 'Enter the appeal reference using numbers 0 to 9' },
			value: appealReference
		});
	}

	// if (/* do sql */) {
	return res.redirect(`appeal-search-no-results?search=${appealReference}`);
	// }

	// eslint-disable-next-line no-unreachable
	res.redirect('appeal-open-comment');
};

module.exports = { enterAppealReferenceGet, enterAppealReferencePost };
