const express = require('express');

const router = express.Router();

const fullPostcodeRegex =
	/^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$/;

const partialPostcodeRegex =
	/^((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))))$/;

router.get('/', (req, res) => {
	res.render(`appeal-search-address/index`);
});

router.post('/', (req, res) => {
	const { postcode } = req.body;

	if (!postcode) {
		return res.render(`appeal-search-address/index`, {
			inlineErrorMessage: { text: 'Enter a postcode' },
			value: postcode
		});
	}

	if (!partialPostcodeRegex.exec(postcode) && !fullPostcodeRegex.exec(postcode)) {
		return res.render(`appeal-search-address/index`, {
			inlineErrorMessage: { text: 'Enter a real postcode' },
			value: postcode
		});
	}

	// if (/* do sql */) {
	return res.redirect(`/appeal-search-no-results?search=${postcode}`);
	// }

	// eslint-disable-next-line no-unreachable
	res.redirect('/open-appeals');
});

module.exports = { router };
