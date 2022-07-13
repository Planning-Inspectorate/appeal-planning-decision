const { documentTypes } = require('@pins/common');
const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { createDocument } = require('../../lib/documents-api-wrapper');
const logger = require('../../lib/logger');
const { getNextTask } = require('../../services/task.service');
const { getTaskStatus } = require('../../services/task.service');
const { postSaveAndReturn } = require('../appeal-householder-decision/save');

const sectionName = 'yourAppealSection';
const taskName = 'appealStatement';

exports.getAppealStatement = (req, res) => {
	res.render(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
		appeal: req.session.appeal
	});
};

exports.postAppealStatement = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;

	if (Object.keys(errors).length > 0) {
		res.render(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
			appeal: req.session.appeal,
			errors,
			errorSummary
		});
		return;
	}

	if (body['does-not-include-sensitive-information'] !== 'i-confirm') {
		res.redirect(`/${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}`);
		return;
	}

	const { appeal } = req.session;

	try {
		appeal.yourAppealSection.appealStatement.hasSensitiveInformation = false;
		if ('files' in req && req.files !== null) {
			if ('appeal-upload' in req.files) {
				const document = await createDocument(
					appeal,
					req.files['appeal-upload'],
					null,
					documentTypes.appealStatement.name
				);

				appeal[sectionName][taskName].uploadedFile = {
					id: document.id,
					name: req.files['appeal-upload'].name,
					fileName: req.files['appeal-upload'].name,
					originalFileName: req.files['appeal-upload'].name,
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
		return res.render(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};
