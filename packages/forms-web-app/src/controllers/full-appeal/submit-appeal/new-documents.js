const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { NEW_DOCUMENTS, OTHER_SUPPORTING_DOCUMENTS, TASK_LIST }
	}
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealDocumentsSection';
const taskName = 'supportingDocuments';

const getNewSupportingDocuments = (req, res) => {
	const {
		[sectionName]: {
			[taskName]: { hasSupportingDocuments }
		}
	} = req.session.appeal;

	res.render(NEW_DOCUMENTS, {
		hasSupportingDocuments
	});
};

const postNewSupportingDocuments = async (req, res) => {
	const {
		body,
		body: { errors = {}, errorSummary = [] },
		session: { appeal }
	} = req;

	if (Object.keys(errors).length > 0) {
		return res.render(NEW_DOCUMENTS, {
			errors,
			errorSummary
		});
	}

	const hasSupportingDocuments = body['supporting-documents'] === 'yes';

	if (!hasSupportingDocuments) {
		appeal[sectionName][taskName].uploadedFiles = [];
	}

	try {
		appeal[sectionName][taskName].hasSupportingDocuments = hasSupportingDocuments;

		if (req.body['save-and-return'] !== '') {
			appeal.sectionStates[sectionName][taskName] = COMPLETED;
			req.session.appeal = await createOrUpdateAppeal(appeal);
			return hasSupportingDocuments
				? res.redirect(`/${OTHER_SUPPORTING_DOCUMENTS}`)
				: res.redirect(`/${TASK_LIST}`);
		}
		appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return await postSaveAndReturn(req, res);
	} catch (err) {
		logger.error(err);

		return res.render(NEW_DOCUMENTS, {
			hasSupportingDocuments,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getNewSupportingDocuments,
	postNewSupportingDocuments
};
