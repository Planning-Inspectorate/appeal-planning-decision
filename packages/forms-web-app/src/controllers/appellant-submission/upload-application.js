const { documentTypes } = require('@pins/common');
const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');
const { createDocument } = require('../../lib/documents-api-wrapper');
const { getNextTask } = require('../../services/task.service');
const { getTaskStatus } = require('../../services/task.service');
const { postSaveAndReturn } = require('../appeal-householder-decision/save');

const sectionName = 'requiredDocumentsSection';
const taskName = 'originalApplication';

exports.getUploadApplication = (req, res) => {
	res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION, {
		appeal: req.session.appeal
	});
};

exports.postUploadApplication = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION, {
			appeal: req.session.appeal,
			errors,
			errorSummary
		});
		return;
	}

	const { appeal } = req.session;

	try {
		if ('files' in req && req.files !== null) {
			if ('application-upload' in req.files) {
				const document = await createDocument(
					appeal,
					req.files['application-upload'],
					null,
					documentTypes.originalApplication.name
				);

				appeal[sectionName][taskName].uploadedFile = {
					id: document.id,
					name: req.files['application-upload'].name,
					fileName: req.files['application-upload'].name,
					originalFileName: req.files['application-upload'].name,
					location: document.location,
					size: document.size
				};
			}
		}
		appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
		if (req.body['save-and-return'] !== '') {
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(getNextTask(appeal, { sectionName, taskName }).href);
		}
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (e) {
		logger.error(e);
		res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};
