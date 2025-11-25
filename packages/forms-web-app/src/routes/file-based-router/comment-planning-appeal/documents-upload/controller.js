const { removeFiles, getValidFiles } = require('#lib/multi-file-upload-helpers');
const { conjoinedPromises } = require('@pins/common/src/utils');
const { getInterestedPartyFromSession } = require('../../../../services/interested-party.service');
const { createDocument } = require('#lib/documents-api-wrapper');
const { mapMultiFileDocumentToSavedDocument } = require('../../../../mappers/document-mapper');

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

	/** @type {InterestedParty} */
	let interestedParty = getInterestedPartyFromSession(req);
	const caseReference = interestedParty.caseReference;

	const submissionData = {
		id: `ip-comments:${caseReference}`,
		referenceNumber: caseReference
	};

	if ('removedFiles' in body) {
		const removedFiles = JSON.parse(body.removedFiles);
		interestedParty.uploadedFiles = await removeFiles(interestedParty.uploadedFiles, removedFiles);
	}

	if ('files' in body && 'supporting-documents' in body.files) {
		const validFiles = getValidFiles(errors, body.files['supporting-documents']);

		if (!interestedParty.uploadedFiles) {
			interestedParty.uploadedFiles = [];
		}
		const resolutions = await conjoinedPromises(validFiles, (file) =>
			createDocument(submissionData, file, file.name, 'interestedPartyComment')
		);

		interestedParty.uploadedFiles?.push(
			...Array.from(resolutions).map(([file, document]) =>
				mapMultiFileDocumentToSavedDocument(document, document?.name, file.name)
			)
		);
	}

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
