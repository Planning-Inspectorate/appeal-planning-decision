const {
	confirmInterestedPartySessionAppealReference,
	getInterestedPartyFromSession
} = require('../../../../services/interested-party.service');

/**
 * @typedef {import('../../../../services/interested-party.service').InterestedParty} InterestedParty
 */

/** @type {import('express').RequestHandler} */
const commentSubmittedGet = (req, res) => {
	if (!confirmInterestedPartySessionAppealReference(req)) {
		return res.redirect(`enter-appeal-reference`);
	}

	/** @type {InterestedParty} */
	const interestedParty = getInterestedPartyFromSession(req);

	if (!interestedParty.submitted) {
		return res.redirect(`check-answers`);
	}

	res.render(`comment-planning-appeal/comment-submitted/index`, { interestedParty });
};

module.exports = { commentSubmittedGet };
