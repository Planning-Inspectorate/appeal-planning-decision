const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.render(`enter-appeal-reference/index`);
});

router.post('/', (req, res) => {
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

	res.redirect('/appeal-open-comment');
});

module.exports = { router };
