const express = require('express');

const router = express.Router();

const fullPostcodeRegex =
	/^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$/;

const partialPostcodeRegex =
	/^((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))))$/;

router.get('/', (req, res) => {
	res.render(`comment-appeal/find-planning-appeal/index`);
});

router.post('/', (req, res) => {
	const { postcode } = req.body;

	if (!postcode) {
		return res.render(`/comment-appeal/find-planning-appeal/index`, {
			inlineErrorMessage: { text: 'Enter a postcode' },
			errorList: [{ text: 'Enter a postcode', href: '#postcode' }],
			value: postcode
		});
	}

	if (!partialPostcodeRegex.exec(postcode) && !fullPostcodeRegex.exec(postcode)) {
		return res.render(`/comment-appeal/find-planning-appeal/index`, {
			inlineErrorMessage: { text: 'Enter a real postcode' },
			errorList: [{ text: 'Enter a real postcode', href: '#postcode' }],
			value: postcode
		});
	}

	const sqlResults = getSqlResults(postcode);

	// if (/* do sql */) {
	// TODO sort conditional logic here
	if (!sqlResults.length) {
		return res.redirect(`/comment-appeal/appeal-search-no-results?search=${postcode}`);
	}
	// }

	// eslint-disable-next-line no-unreachable
	res.redirect(`/comment-appeal/appeals?search=${postcode}`);
});

// placeholder
const getSqlResults = (postcode) => [1, 2, 3, postcode];

module.exports = { router };
