const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { UPLOAD_COMMUNICATION_WITH_PLANNING_INSPECTORATE }
	}
} = require('../../lib/views');
const { createDocument } = require('#lib/documents-api-wrapper');
const { documentTypes } = require('@pins/common');
const { getTaskStatus } = require('../../services/task.service');
const { getValidFiles } = require('../../lib/multi-file-upload-helpers');
const { mapMultiFileDocumentToSavedDocument } = require('../../mappers/document-mapper');

const sectionName = 'beforeYouStart';
const taskName = documentTypes.uploadPriorCorrespondence.name;
exports.getUploadCommunicationWithPlanningInspectorate = (req, res) => {
	res.render(UPLOAD_COMMUNICATION_WITH_PLANNING_INSPECTORATE);
};

exports.postUploadCommunicationWithPlanningInspectorate = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	if (Object.keys(errors).length > 0) {
		res.render(UPLOAD_COMMUNICATION_WITH_PLANNING_INSPECTORATE, {
			errors,
			errorSummary
		});
		return;
	}

	let { appeal } = req.session;

	try {
		if ('files' in body && 'communication-with-planning-inspectorate' in body.files) {
			const validFiles = getValidFiles(
				errors,
				body.files['communication-with-planning-inspectorate']
			);
			// eslint-disable-next-line no-restricted-syntax
			for await (const file of validFiles) {
				const document = await createDocument(
					appeal,
					file,
					file.name,
					documentTypes.uploadPriorCorrespondence.name
				);

				if (!appeal[sectionName]) {
					appeal[sectionName] = {};
				}
				if (!appeal[sectionName][taskName]) {
					appeal[sectionName][taskName] = {};
				}

				if (!appeal[sectionName][taskName].uploadedFiles) {
					appeal[sectionName][taskName].uploadedFiles = [];
				}
				appeal[sectionName][taskName].uploadedFiles.push(
					mapMultiFileDocumentToSavedDocument(document, document.name, file.name)
				);
			}
		}
		if (!appeal.sectionStates) {
			appeal.sectionStates = {};
		}
		if (!appeal.sectionStates[sectionName]) {
			appeal.sectionStates[sectionName] = {};
		}
		appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);

		req.session.appeal = await createOrUpdateAppeal(appeal);
		return res.redirect('/before-you-start/can-use-service');
	} catch (e) {
		logger.error(e);
		res.render(UPLOAD_COMMUNICATION_WITH_PLANNING_INSPECTORATE, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};
