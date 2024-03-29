const logger = require('../../lib/logger');
const { getTaskStatus } = require('../../services/task.service');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const { postSaveAndReturn } = require('../appeal-householder-decision/save');

const sectionName = 'aboutYouSection';
const taskName = 'yourDetails';

const FORM_FIELD = {
	'original-application-your-name': {
		id: 'original-application-your-name',
		items: [
			{
				value: 'yes',
				text: 'Yes, the original application was made in my name'
			},
			{
				value: 'no',
				text: "No, I'm an agent acting on behalf of the applicant"
			}
		]
	}
};

exports.FORM_FIELD = FORM_FIELD;

exports.getWhoAreYou = (req, res) => {
	res.render(VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU, {
		FORM_FIELD,
		appeal: req.session.appeal
	});
};

exports.postWhoAreYou = async (req, res) => {
	const { body } = req;

	const { errors = {}, errorSummary = [] } = body;

	const { appeal } = req.session;
	const task = appeal[sectionName][taskName];

	switch (body['original-application-your-name']) {
		case 'yes': {
			task.isOriginalApplicant = true;
			break;
		}
		case 'no': {
			task.isOriginalApplicant = false;
			break;
		}
		default: {
			task.isOriginalApplicant = undefined;
			break;
		}
	}

	if (Object.keys(errors).length > 0) {
		return res.render(VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU, {
			appeal,
			errors,
			errorSummary,
			FORM_FIELD
		});
	}

	try {
		appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
		if (req.body['save-and-return'] !== '') {
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return res.redirect(`/${VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS}`);
		}
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (e) {
		logger.error(e);

		return res.render(VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }],
			FORM_FIELD
		});
	}
};
