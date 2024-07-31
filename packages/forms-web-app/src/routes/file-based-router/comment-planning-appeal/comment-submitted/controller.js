const {
	confirmInterestedPartySessionCaseReference,
	getInterestedPartyFromSession,
	resetInterestedPartySession
} = require('../../../../services/interested-party.service');

/**
 * @typedef {import('../../../../services/interested-party.service').InterestedParty} InterestedParty
 */

/** @type {import('express').RequestHandler} */
const commentSubmittedGet = (req, res) => {
	if (!confirmInterestedPartySessionCaseReference(req)) {
		return res.redirect(`enter-appeal-reference`);
	}

	/** @type {InterestedParty} */
	const interestedParty = getInterestedPartyFromSession(req);

	if (!interestedParty.submitted) {
		return res.redirect(`check-answers`);
	}

	resetInterestedPartySession(req);

	res.render(`comment-planning-appeal/comment-submitted/index`, { interestedParty });
};

module.exports = { commentSubmittedGet };
