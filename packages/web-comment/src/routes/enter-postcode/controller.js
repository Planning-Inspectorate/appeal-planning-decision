const { fullPostcodeRegex, partialPostcodeRegex } = require('./regex');

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
