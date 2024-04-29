const logger = require('../../lib/logger');
const { getDepartmentFromId } = require('../../services/department.service');
const { getLPAById } = require('../../lib/appeals-api-wrapper');
const { postSaveAndReturn } = require('../appeal-householder-decision/save');
const { FLAG } = require('@pins/common/src/feature-flags');
const { APPEALS_CASE_DATA } = require('@pins/common/src/constants');
const { isFeatureActive } = require('../../featureFlag');
const {
	baseHASSubmissionUrl,
	taskListUrl
} = require('../../dynamic-forms/has-appeal-form/journey');

const getListOfDocuments = (req, res) => {
	res.render('appeal-householder-decision/list-of-documents');
};

const postListOfDocuments = async (req, res) => {
	const { body } = req;
	const { errors = {} } = body;

	try {
		if (req.body['save-and-return'] !== '') {
			const appeal = req.session.appeal;

			const usingV2Form = await isFeatureActive(FLAG.APPEAL_FORM_V2, appeal.lpaCode);

			// v1
			if (!usingV2Form) {
				return res.redirect('/appeal-householder-decision/task-list');
			}

			// v2
			const lpa = await getDepartmentFromId(appeal.lpaCode);
			const lpaCode = lpa.lpaCode ?? (await getLPAById(lpa.id)).lpaCode; // fallback to lookup in case cached lpa doesn't have code

			const appealSubmission = await req.appealsApiClient.createAppellantSubmission({
				appealId: appeal.appealSqlId,
				LPACode: lpaCode,
				appealTypeCode: APPEALS_CASE_DATA.APPEAL_TYPE_CODE.HAS, // we should define this in a table + align with data model
				applicationDecisionDate: appeal.decisionDate,
				applicationReference: appeal.planningApplicationNumber,
				applicationDecision: appeal.eligibility.applicationDecision
			});
			req.session.appeal = null;
			return res.redirect(`${baseHASSubmissionUrl}/${taskListUrl}?id=${appealSubmission.id}`);
		}

		return await postSaveAndReturn(req, res);
	} catch (e) {
		logger.error(e);
		return res.render('appeal-householder-decision/list-of-documents', {
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getListOfDocuments,
	postListOfDocuments
};
