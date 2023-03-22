const logger = require('../../lib/logger');

const { VIEW } = require('../../lib/views');

const getUploadDocuments = async (req, res) => {
	res.render(VIEW.FINAL_COMMENT.UPLOAD_DOCUMENTS, {
		finalComment: req.session?.finalComment
	});
};

const postUploadDocuments = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	// DEV ONLY - these req.session checks should not be necessary once this page is integrated into the full final-comment journey
	if (!req.session?.finalComment) {
		req.session.finalComment = {};
	}
	if (!req.session.finalComment?.supportingDocuments) {
		req.session.finalComment.supportingDocuments = { uploadedFiles: [] };
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

	try {
		if ('removedFiles' in body) {
			const removedFiles = JSON.parse(body.removedFiles);

			for (const removedFile of removedFiles) {
				req.session.finalComment.supportingDocuments.uploadedFiles =
					req.session.finalComment.supportingDocuments.uploadedFiles.filter(
						(file) => file.name !== removedFile.name
					);
			}
		}

		if ('files' in body && 'upload-documents' in body.files) {
			// eslint-disable-next-line no-restricted-syntax
			for await (const file of body.files['upload-documents']) {
				//TODO: (as-5786) call document API here

				req.session.finalComment.supportingDocuments.uploadedFiles.push({
					name: file.name,
					// needed for MoJ multi-file upload display
					message: {
						text: file.name
					},
					fileName: file.name,
					originalFileName: file.name
					//todo: (as-5786) add location, size, and id (will be returned from document api)
				});
			}
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
