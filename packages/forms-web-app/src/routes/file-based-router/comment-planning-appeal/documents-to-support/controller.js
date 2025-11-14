const {
	getInterestedPartyFromSession,
	updateInterestedPartySession
} = require('../../../../services/interested-party.service');

/**
 * @typedef {import('../../../../services/interested-party.service').InterestedParty} InterestedParty
 */

/** @type {import('express').RequestHandler} */
const documentsToSupportGet = (req, res) => {
	/** @type {InterestedParty} */
	const interestedParty = getInterestedPartyFromSession(req);

	res.render(`comment-planning-appeal/documents-to-support/index`, { interestedParty });
};

/** @type {import('express').RequestHandler} */
const documentsToSupportPost = async (req, res) => {
	const { body } = req;
	const {
		errors = {},
		errorSummary = [],
		'documents-to-support-comment': hasDocumentsToSupportComment
	} = body;

	/** @type {InterestedParty} */
	const interestedParty = updateInterestedPartySession(req, { hasDocumentsToSupportComment });

	if (Object.keys(errors).length > 0) {
		return res.render(`comment-planning-appeal/documents-to-support/index`, {
			interestedParty,
			errors,
			errorSummary
		});
	}

	if (hasDocumentsToSupportComment == 'yes') {
		return res.redirect(`documents-upload`);
	}
	return res.redirect(`check-answers`);
};

module.exports = { documentsToSupportGet, documentsToSupportPost };
