const {
	confirmInterestedPartySessionCaseReference,
	getInterestedPartyFromSession,
	updateInterestedPartySession
} = require('../../../../services/interested-party.service');

/**
 * @typedef {import('../../../../services/interested-party.service').InterestedParty} InterestedParty
 */

/** @type {import('express').RequestHandler} */
const yourNameGet = (req, res) => {
	if (!confirmInterestedPartySessionCaseReference(req)) {
		return res.redirect(`enter-appeal-reference`);
	}

	/** @type {InterestedParty} */
	const interestedParty = getInterestedPartyFromSession(req);

	res.render(`comment-planning-appeal/your-name/index`, { interestedParty });
};

/** @type {import('express').RequestHandler} */
const yourNamePost = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [], 'first-name': firstName, 'last-name': lastName } = body;

	/** @type {InterestedParty} */
	const interestedParty = updateInterestedPartySession(req, {
		firstName,
		lastName
	});

	if (Object.keys(errors).length > 0) {
		return res.render(`comment-planning-appeal/your-name/index`, {
			interestedParty,
			errors,
			errorSummary
		});
	}

	return res.redirect(`enter-address`);
};

module.exports = { yourNameGet, yourNamePost };
