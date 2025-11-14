const {
	getInterestedPartyFromSession,
	updateInterestedPartySession
} = require('../../../../services/interested-party.service');

/**
 * @typedef {import('../../../../services/interested-party.service').InterestedParty} InterestedParty
 */

/** @type {import('express').RequestHandler} */
const documentsUploadGet = (req, res) => {
	/** @type {InterestedParty} */
	const interestedParty = getInterestedPartyFromSession(req);

	res.render(`comment-planning-appeal/documents-upload/index`, { interestedParty });
};

/** @type {import('express').RequestHandler} */
const documentsUploaddPost = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	const uploadedDocuments = body.files?.['supporting-documents'] ?? [];

	const documentsWithRenamedKey = uploadedDocuments.map((doc) => {
		const { name, ...rest } = doc;

		return {
			...rest,
			originalFileName: name
		};
	});

	/** @type {InterestedParty} */
	const interestedParty = updateInterestedPartySession(req, {
		uploadedDocuments: documentsWithRenamedKey
	});
	if (Object.keys(errors).length > 0) {
		return res.render(`comment-planning-appeal/documents-upload/index`, {
			interestedParty,
			errors,
			errorSummary
		});
	}

	return res.redirect(`check-answers`);
};

module.exports = { documentsUploadGet, documentsUploaddPost };
