const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.render(`appeal-search-number/index`);
});

router.post('/', (req, res) => {
	const { 'appeal-reference': appealReference } = req.body;

	if (!appealReference) {
		return res.render(`appeal-search-number/index`, {
			inlineErrorMessage: { text: 'Enter the appeal reference' },
			value: appealReference
		});
	}

	if (!/^[0-9]{7}$/.exec(appealReference)) {
		return res.render(`appeal-search-number/index`, {
			inlineErrorMessage: { text: 'Enter the appeal reference using numbers 0 to 9' },
			value: appealReference
		});
	}

	// if (/* do sql */) {
	return res.redirect(`/appeal-search-no-results?search=${appealReference}`);
	// }

	// eslint-disable-next-line no-unreachable
	res.redirect('/appeal-open-comment');
});

module.exports = { router };
