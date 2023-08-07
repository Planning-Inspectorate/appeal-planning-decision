const { documentTypes } = require('@pins/common');
const logger = require('../../lib/logger');
const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { createDocument } = require('../../lib/documents-api-wrapper');
const { getTaskStatus } = require('../../services/task.service');
const { getNextTask } = require('../../services/task.service');
const { postSaveAndReturn } = require('../appeal-householder-decision/save');

const sectionName = 'requiredDocumentsSection';
const taskName = 'decisionLetter';
const sectionTag = 'LPA DECISION NOTICE';

exports.getUploadDecision = (req, res) => {
	res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION, {
		appeal: req.session.appeal
	});
};

exports.postUploadDecision = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	if (Object.keys(errors).length > 0) {
		/* istanbul ignore next */
		res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION, {
			appeal: req.session.appeal || {},
			errors,
			errorSummary
		});
		return;
	}

	const { appeal } = req.session;

	try {
		if ('files' in req && req.files !== null) {
			if ('file-upload' in req.files) {
				const document = await createDocument(
					appeal,
					req.files['file-upload'],
					null,
					documentTypes.decisionLetter.name,
					sectionTag
				);

				appeal[sectionName][taskName].uploadedFile = {
					id: document.id,
					name: document.name,
					fileName: document.name,
					originalFileName: req.files['file-upload'].name,
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
		return res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};
