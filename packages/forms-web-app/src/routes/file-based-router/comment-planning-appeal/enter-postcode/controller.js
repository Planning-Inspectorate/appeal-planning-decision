const { fullPostcodeRegex, partialPostcodeRegex } = require('@pins/common/src/regex');
const { resetInterestedPartySession } = require('../../../../services/interested-party.service');
const { getUserDashboardLink } = require('#lib/get-user-back-links');

/** @type {import('express').RequestHandler} */
const enterPostcodeGet = (req, res) => {
	resetInterestedPartySession(req);
	const trailingSlashRegex = /\/$/;
	const userRouteUrl = req.originalUrl.replace(trailingSlashRegex, '');
	const backLinkToDashboard = getUserDashboardLink(userRouteUrl);
	const previousUrl =
		req?.session?.navigationHistory?.length > 0
			? req?.session?.navigationHistory[1]
			: backLinkToDashboard;
	res.render(`comment-planning-appeal/enter-postcode/index`, {
		backLink: previousUrl
	});
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
