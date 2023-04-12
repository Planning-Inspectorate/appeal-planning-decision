const {
	documentTypes: {
		decisionPlans: { name: documentType }
	}
} = require('@pins/common');
const {
	VIEW: {
		FULL_APPEAL: { PLANS_DRAWINGS, PLANNING_OBLIGATION_PLANNED }
	}
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
const { createDocument } = require('../../../lib/documents-api-wrapper');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');
const { removeFiles, getValidFiles } = require('../../../lib/multi-file-upload-helpers');
const { mapMultiFileDocumentToSavedDocument } = require('../../../mappers/document-mapper');

const sectionName = 'appealDocumentsSection';
const taskName = 'plansDrawings';
const sectionTag = 'LIST OF PLANS SUBMITTED AFTER LPA DECISION';

const getPlansDrawings = (req, res) => {
	res.render(PLANS_DRAWINGS, {
		uploadedFiles: req.session.appeal[sectionName][taskName].uploadedFiles
	});
};

const postPlansDrawings = async (req, res) => {
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
				const document = await createDocument(appeal, file, null, documentType, sectionTag);

				appeal[sectionName][taskName].uploadedFiles.push(
					mapMultiFileDocumentToSavedDocument(document, file.name)
				);
			}
		}

		req.session.appeal = await createOrUpdateAppeal(appeal);

		if (Object.keys(errors).length > 0) {
			return res.render(PLANS_DRAWINGS, {
				uploadedFiles: appeal[sectionName][taskName].uploadedFiles,
				errors,
				// multi-file upload validation would otherwise map these errors individual to e.g.
				// `#files.supporting-documents[3]` which does not meet the gov uk presentation requirements.
				errorSummary: errorSummary.map((error) => ({
					...error,
					href: '#plans-drawings-error'
				}))
			});
		}

		// this is the `name` of the 'upload' button in the template.
		if (body['upload-and-remain-on-page']) {
			return res.redirect(`/${PLANS_DRAWINGS}`);
		}

		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(`/${PLANNING_OBLIGATION_PLANNED}`);
		}

		appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);
		return res.render(PLANS_DRAWINGS, {
			uploadedFiles: appeal[sectionName][taskName].uploadedFiles,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getPlansDrawings,
	postPlansDrawings
};
