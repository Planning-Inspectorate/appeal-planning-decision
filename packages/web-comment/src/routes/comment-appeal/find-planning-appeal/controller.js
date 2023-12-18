const fullPostcodeRegex =
	/^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$/;

const partialPostcodeRegex =
	/^((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))))$/;

/** @type {import('express').RequestHandler} */
const findPlanningAppealGet = (req, res) => {
	res.render(`comment-appeal/find-planning-appeal/index`);
};

/** @type {import('express').RequestHandler} */
const findPlanningAppealPost = (req, res) => {
	const { postcode } = req.body;

	if (!postcode) {
		return res.render(`/comment-appeal/find-planning-appeal/index`, {
			inlineErrorMessage: { text: 'Enter a postcode' },
			value: postcode
		});
	}

	if (!partialPostcodeRegex.exec(postcode) && !fullPostcodeRegex.exec(postcode)) {
		return res.render(`/comment-appeal/find-planning-appeal/index`, {
			inlineErrorMessage: { text: 'Enter a real postcode' },
			value: postcode
		});
	}

	// eslint-disable-next-line no-unreachable
	res.redirect(`/comment-appeal/appeals?search=${postcode}`);
};

module.exports = { findPlanningAppealGet, findPlanningAppealPost };
