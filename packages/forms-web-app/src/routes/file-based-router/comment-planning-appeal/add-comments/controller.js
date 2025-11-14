const {
	getInterestedPartyFromSession,
	updateInterestedPartySession
} = require('../../../../services/interested-party.service');

/**
 * @typedef {import('../../../../services/interested-party.service').InterestedParty} InterestedParty
 */

/** @type {import('express').RequestHandler} */
const addCommentsGet = (req, res) => {
	/** @type {InterestedParty} */
	const interestedParty = getInterestedPartyFromSession(req);

	res.render(`comment-planning-appeal/add-comments/index`, { interestedParty });
};

/** @type {import('express').RequestHandler} */
const addCommentsPost = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [], comments } = body;

	const interestedParty = updateInterestedPartySession(req, { comments });

	if (Object.keys(errors).length > 0) {
		return res.render(`comment-planning-appeal/add-comments/index`, {
			interestedParty,
			errors,
			errorSummary
		});
	}

	return res.redirect(`documents-to-support`);
};

module.exports = { addCommentsGet, addCommentsPost };
