const logger = require('../../lib/logger');
const { removeFiles, getValidFiles } = require('../../lib/multi-file-upload-helpers');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { COMPLETED, IN_PROGRESS } = require('../../services/task-status/task-statuses');
const { createDocument } = require('../../lib/documents-api-wrapper');
const { mapMultiFileDocumentToSavedDocument } = require('../../mappers/document-mapper');
const { postSaveAndReturn } = require('../save');
const { conjoinedPromises } = require('@pins/common/src/utils');

const getAppealMultiFileUpload = (view) => {
	return async (req, res) => {
		res.render(view, {
			uploadedFiles: req.session.appeal[req.sectionName][req.taskName].uploadedFiles
		});
	};
};

const postAppealMultiFileUpload = (
	currentView,
	nextView,
	documentType,
	taskStateName,
	sectionTag = ''
) => {
	return async (req, res) => {
		const { body, sectionName, taskName } = req;
		const { errors = {}, errorSummary = [] } = body;
		const { appeal } = req.session;
		const appealTask = appeal[sectionName][taskName];

		try {
			if ('removedFiles' in body) {
				const removedFiles = JSON.parse(body.removedFiles);
				appealTask.uploadedFiles = await removeFiles(appealTask.uploadedFiles, removedFiles);
			}

			if ('files' in body && 'file-upload' in body.files) {
				const validFiles = getValidFiles(errors, body.files['file-upload']);

				const resolutions = await conjoinedPromises(validFiles, createDocument, {
					asyncDepMapPredicate: (file) => [appeal, file, file.name, documentType, sectionTag],
					applyMode: true
				});

				const result = Array.from(resolutions).map(([file, document]) =>
					mapMultiFileDocumentToSavedDocument(document, document?.name, file.name)
				);

				appealTask.uploadedFiles.concat(result);
			}

			req.session.appeal = await createOrUpdateAppeal(appeal);

			if (Object.keys(errors).length > 0) {
				return res.render(currentView, {
					uploadedFiles: appealTask.uploadedFiles,
					errors,
					// multi-file upload validation would otherwise map these errors individual to e.g.
					// `#files.supporting-documents[3]` which does not meet the gov uk presentation requirements.
					errorSummary: errorSummary.map((error) => ({
						...error,
						href: '#'
					}))
				});
			}

			// this is the `name` of the 'upload' button in the template.
			if (body['upload-and-remain-on-page']) {
				return res.redirect(`/${currentView}`);
			}

			if (req.body['save-and-return'] !== '') {
				appeal.sectionStates[sectionName][taskStateName] = COMPLETED;
				req.session.appeal = await createOrUpdateAppeal(appeal);
				return res.redirect(`/${nextView}`);
			}
			appeal.sectionStates[sectionName][taskStateName] = IN_PROGRESS;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return await postSaveAndReturn(req, res);
		} catch (err) {
			logger.error(err);
			return res.render(currentView, {
				uploadedFiles: appealTask.uploadedFiles,
				errorSummary: [{ text: err.toString(), href: '#' }]
			});
		}
	};
};

module.exports = {
	getAppealMultiFileUpload,
	postAppealMultiFileUpload
};
