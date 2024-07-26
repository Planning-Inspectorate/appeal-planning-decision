const {
	confirmInterestedPartySessionAppealReference,
	getInterestedPartyFromSession,
	updateInterestedPartySession
} = require('../../../../services/interested-party.service');

/**
 * @typedef {import('../../../../services/interested-party.service').InterestedParty} InterestedParty
 */

/** @type {import('express').RequestHandler} */
const emailAddressGet = (req, res) => {
	if (!confirmInterestedPartySessionAppealReference(req)) {
		return res.redirect(`enter-appeal-reference`);
	}

	/** @type {InterestedParty} */
	const interestedParty = getInterestedPartyFromSession(req);

	res.render(`comment-planning-appeal/email-address/index`, { interestedParty });
};

/** @type {import('express').RequestHandler} */
const emailAddressPost = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [], 'email-address': emailAddress } = body;

	/** @type {InterestedParty} */
	const interestedParty = updateInterestedPartySession(req, { emailAddress });

	if (Object.keys(errors).length > 0) {
		return res.render(`comment-planning-appeal/email-address/index`, {
			interestedParty,
			errors,
			errorSummary
		});
	}

	return res.redirect(`add-comments`);
};

module.exports = { emailAddressGet, emailAddressPost };
