const {
	checkInterestedPartySessionCaseReferenceSet,
	getInterestedPartyFromSession,
	resetInterestedPartySession,
	checkIfInterestedPartySessionSubmitted
} = require('../../../../services/interested-party.service');

/**
 * @typedef {import('../../../../services/interested-party.service').InterestedParty} InterestedParty
 */

/** @type {import('express').RequestHandler} */
const commentSubmittedGet = (req, res) => {
	if (!checkInterestedPartySessionCaseReferenceSet(req)) {
		return res.redirect(`enter-appeal-reference`);
	}

	if (!checkIfInterestedPartySessionSubmitted(req)) {
		return res.redirect(`check-answers`);
	}

	/** @type {InterestedParty} */
	const interestedParty = getInterestedPartyFromSession(req);

	resetInterestedPartySession(req);

	res.render(`comment-planning-appeal/comment-submitted/index`, { interestedParty });
};

module.exports = { commentSubmittedGet };
