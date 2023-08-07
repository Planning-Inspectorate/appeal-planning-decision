const logger = require('../../lib/logger');

const { VIEW } = require('../../lib/views');
const { documentTypes } = require('@pins/common');

const { createDocument } = require('../../lib/documents-api-wrapper');
const { getValidFiles, removeFiles } = require('../../lib/multi-file-upload-helpers');
const { mapMultiFileDocumentToSavedDocument } = require('../../mappers/document-mapper');

const getUploadDocuments = async (req, res) => {
	res.render(VIEW.FINAL_COMMENT.UPLOAD_DOCUMENTS, {
		uploadedFiles: req.session.finalComment.supportingDocuments.uploadedFiles
	});
};

const postUploadDocuments = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	try {
		if ('removedFiles' in body) {
			const documents = req.session.finalComment.supportingDocuments;
			const removedFiles = JSON.parse(body.removedFiles);

			documents.uploadedFiles = removeFiles(documents.uploadedFiles, removedFiles);
		}

		if ('files' in body && 'upload-documents' in body.files) {
			const validFiles = getValidFiles(errors, body.files['upload-documents']);
			// eslint-disable-next-line no-restricted-syntax
			for await (const file of validFiles) {
				const document = await createDocument(
					req.session.finalComment,
					file,
					file.name,
					documentTypes.uploadDocuments.name
				);

				req.session.finalComment.supportingDocuments.uploadedFiles.push(
					mapMultiFileDocumentToSavedDocument(document, document.name, file.name)
				);
			}
		}

		if (Object.keys(errors).length > 0) {
			return res.render(VIEW.FINAL_COMMENT.UPLOAD_DOCUMENTS, {
				finalComment: req.session.finalComment,
				errors,
				// multi-file upload validation would otherwise map these errors individually to e.g.
				// `#files.supporting-documents[3]` which does not meet the gov uk presentation requirements.
				errorSummary: errorSummary.map((error) => ({
					...error,
					href: '#upload-documents-error'
				}))
			});
		}

		// this is the `name` of the 'upload' button in the template.
		if (body['upload-and-remain-on-page']) {
			return res.redirect(`/${VIEW.FINAL_COMMENT.UPLOAD_DOCUMENTS}`);
		}

		return res.redirect(`/${VIEW.FINAL_COMMENT.CHECK_YOUR_ANSWERS}`);
	} catch (e) {
		logger.error(e);
		return res.render(VIEW.FINAL_COMMENT.UPLOAD_DOCUMENTS, {
			finalComment: req.session.finalComment,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getUploadDocuments,
	postUploadDocuments
};
