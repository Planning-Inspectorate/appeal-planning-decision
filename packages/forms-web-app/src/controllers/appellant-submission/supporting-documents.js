const { documentTypes } = require('@pins/common');
const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { createDocument } = require('../../lib/documents-api-wrapper');
const { postSaveAndReturn } = require('../appeal-householder-decision/save');

const {
	getNextTask,
	setTaskStatusComplete,
	setTaskStatusNotStarted
} = require('../../services/task.service');
const { getValidFiles, removeFiles } = require('../../lib/multi-file-upload-helpers');
const { mapMultiFileDocumentToSavedDocument } = require('../../mappers/document-mapper');

const sectionName = 'yourAppealSection';
const taskName = 'otherDocuments';

exports.getSupportingDocuments = (req, res) => {
	res.render(VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS, {
		appeal: req.session.appeal
	});
};

exports.postSupportingDocuments = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	try {
		if ('removedFiles' in body) {
			const appealTask = appeal[sectionName][taskName];
			const removedFiles = JSON.parse(body.removedFiles);

			appealTask.uploadedFiles = removeFiles(appealTask.uploadedFiles, removedFiles);
		}

		if ('files' in body && 'supporting-documents' in body.files) {
			const validFiles = getValidFiles(errors, body.files['supporting-documents']);

			// eslint-disable-next-line no-restricted-syntax
			for await (const file of validFiles) {
				const document = await createDocument(
					appeal,
					file,
					file.name,
					documentTypes.otherDocuments.name
				);

				appeal[sectionName][taskName].uploadedFiles.push(
					mapMultiFileDocumentToSavedDocument(document, document.name, file.name)
				);
			}
		}

		if (Object.keys(errors).length > 0) {
			return res.render(VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS, {
				appeal,
				errors,
				// multi-file upload validation would otherwise map these errors individual to e.g.
				// `#files.supporting-documents[3]` which does not meet the gov uk presentation requirements.
				errorSummary: errorSummary.map((error) => ({
					...error,
					href: '#supporting-documents-error'
				}))
			});
		}

		// this is the `name` of the 'upload' button in the template.
		if (body['upload-and-remain-on-page']) {
			return res.redirect(`/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`);
		}

		appeal.sectionStates[sectionName][taskName] = setTaskStatusComplete();
		if (req.body['save-and-return'] !== '') {
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(getNextTask(appeal, { sectionName, taskName }).href);
		}

		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (e) {
		logger.error(e);
		appeal.sectionStates[sectionName][taskName] = setTaskStatusNotStarted();
		return res.render(VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};
