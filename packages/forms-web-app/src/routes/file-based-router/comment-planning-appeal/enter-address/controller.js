const {
	confirmInterestedPartySessionAppealReference,
	getInterestedPartyFromSession,
	updateInterestedPartySession
} = require('../../../../services/interested-party.service');

/**
 * @typedef {import('../../../../services/interested-party.service').InterestedParty} InterestedParty
 */
/** @type {import('express').RequestHandler} */
const enterAddressGet = (req, res) => {
	if (!confirmInterestedPartySessionAppealReference(req)) {
		return res.redirect(`enter-appeal-reference`);
	}

	/** @type {InterestedParty} */
	const interestedParty = getInterestedPartyFromSession(req);

	res.render(`comment-planning-appeal/enter-address/index`, { interestedParty });
};

/** @type {import('express').RequestHandler} */
const enterAddressPost = async (req, res) => {
	const { body } = req;
	const {
		errors = {},
		errorSummary = [],
		addressLine1,
		addressLine2,
		townCity,
		county,
		postcode
	} = body;

	const address = {
		addressLine1,
		addressLine2,
		townCity,
		county,
		postcode
	};

	/** @type {InterestedParty} */
	const interestedParty = updateInterestedPartySession(req, { address });

	if (Object.keys(errors).length > 0) {
		return res.render(`comment-planning-appeal/enter-address/index`, {
			interestedParty,
			errors,
			errorSummary
		});
	}

	return res.redirect(`email-address`);
};

module.exports = { enterAddressGet, enterAddressPost };
