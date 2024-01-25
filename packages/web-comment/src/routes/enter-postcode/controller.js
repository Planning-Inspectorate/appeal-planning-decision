const fullPostcodeRegex =
	/^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$/;

const partialPostcodeRegex =
	/^((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))))$/;

/** @type {import('express').RequestHandler} */
const enterPostcodeGet = (req, res) => {
	res.render(`enter-postcode/index`);
};

/** @type {import('express').RequestHandler} */
const enterPostcodePost = (req, res) => {
	const { postcode } = req.body;

	if (!postcode) {
		return res.render(`enter-postcode/index`, {
			error: { text: 'Enter a postcode', href: '#postcode' },
			value: postcode
		});
	}

	if (!partialPostcodeRegex.exec(postcode) && !fullPostcodeRegex.exec(postcode)) {
		return res.render(`enter-postcode/index`, {
			error: { text: 'Enter a real postcode', href: '#postcode' },
			value: postcode
		});
	}

	res.redirect(`appeals?search=${postcode}`);
};

module.exports = { enterPostcodeGet, enterPostcodePost };
