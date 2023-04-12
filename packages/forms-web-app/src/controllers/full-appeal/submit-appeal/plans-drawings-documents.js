const {
	documentTypes: {
		plansDrawingsSupportingDocuments: { name: documentType }
	}
} = require('@pins/common');
const {
	VIEW: {
		FULL_APPEAL: { PLANS_DRAWINGS_DOCUMENTS, DESIGN_ACCESS_STATEMENT_SUBMITTED }
	}
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');
const { removeFiles, getValidFiles } = require('../../../lib/multi-file-upload-helpers');
const { mapMultiFileDocumentToSavedDocument } = require('../../../mappers/document-mapper');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = documentType;

const getPlansDrawingsDocuments = (req, res) => {
	res.render(PLANS_DRAWINGS_DOCUMENTS, {
		uploadedFiles: req.session.appeal[sectionName][taskName].uploadedFiles
	});
};

const postPlansDrawingsDocuments = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	try {
		if ('removedFiles' in body) {
			const appealTask = appeal[sectionName][taskName];
			const removedFiles = JSON.parse(body.removedFiles);

			appealTask.uploadedFiles = removeFiles(appealTask.uploadedFiles, removedFiles);
		}

		if ('files' in body && 'file-upload' in body.files) {
			const validFiles = getValidFiles(errors, body.files['file-upload']);

			// eslint-disable-next-line no-restricted-syntax
			for await (const file of validFiles) {
				const document = await createDocument(appeal, file, file.name, documentType);

				appeal[sectionName][taskName].uploadedFiles.push(
					mapMultiFileDocumentToSavedDocument(document, file.name)
				);
			}
		}

		req.session.appeal = await createOrUpdateAppeal(appeal);

		if (Object.keys(errors).length > 0) {
			return res.render(PLANS_DRAWINGS_DOCUMENTS, {
				uploadedFiles: appeal[sectionName][taskName].uploadedFiles,
				errors,
				// multi-file upload validation would otherwise map these errors individual to e.g.
				// `#files.supporting-documents[3]` which does not meet the gov uk presentation requirements.
				errorSummary: errorSummary.map((error) => ({
					...error,
					href: '#plans-drawings-documents-error'
				}))
			});
		}

		// this is the `name` of the 'upload' button in the template.
		if (body['upload-and-remain-on-page']) {
			return res.redirect(`/${PLANS_DRAWINGS_DOCUMENTS}`);
		}

		if (req.body['save-and-return'] !== '') {
			req.session.appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(`/${DESIGN_ACCESS_STATEMENT_SUBMITTED}`);
		}
		appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);
		return res.render(PLANS_DRAWINGS_DOCUMENTS, {
			uploadedFiles: appeal[sectionName][taskName].uploadedFiles,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};
module.exports = {
	getPlansDrawingsDocuments,
	postPlansDrawingsDocuments
};
