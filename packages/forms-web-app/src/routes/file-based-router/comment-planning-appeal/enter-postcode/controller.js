const { fullPostcodeRegex, partialPostcodeRegex } = require('@pins/common/src/regex');
const { resetInterestedPartySession } = require('../../../../services/interested-party.service');

/** @type {import('express').RequestHandler} */
const enterPostcodeGet = (req, res) => {
	console.log('oioioioio');
	console.log(req.session);
	console.log('pepepepe');
	console.log(req.appealsApiClient);

	resetInterestedPartySession(req);
	res.render(`comment-planning-appeal/enter-postcode/index`);
};

/** @type {import('express').RequestHandler} */
const enterPostcodePost = (req, res) => {
	const { postcode } = req.body;

	if (!postcode) {
		return res.render(`comment-planning-appeal/enter-postcode/index`, {
			error: { text: 'Enter a postcode', href: '#postcode' },
			value: postcode
		});
	}

	if (!partialPostcodeRegex.exec(postcode) && !fullPostcodeRegex.exec(postcode)) {
		return res.render(`comment-planning-appeal/enter-postcode/index`, {
			error: { text: 'Enter a real postcode', href: '#postcode' },
			value: postcode
		});
	}

	res.redirect(`appeals?search=${postcode}`);
};

module.exports = { enterPostcodeGet, enterPostcodePost };
