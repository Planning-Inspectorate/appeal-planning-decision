const logger = require('../../../lib/logger');
const { getDepartmentFromId } = require('../../../services/department.service');
const { getLPAById, deleteAppeal } = require('../../../lib/appeals-api-wrapper');
const { isFeatureActive } = require('../../../featureFlag');
const {
	VIEW: {
		FULL_APPEAL: { LIST_OF_DOCUMENTS_V1: currentPage, TASK_LIST }
	}
} = require('../../../lib/full-appeal/views');
const { postSaveAndReturn } = require('../../save');
const { FLAG } = require('@pins/common/src/feature-flags');
const { CASE_TYPES, caseTypeLookup } = require('@pins/common/src/database/data-static');
const {
	baseS78SubmissionUrl,
	taskListUrl
} = require('../../../dynamic-forms/s78-appeal-form/journey');
const config = require('../../../config');

const getListOfDocuments = async (req, res) => {
	const appeal = req.session.appeal;
	const appealType = caseTypeLookup(appeal.appealType, 'id')?.processCode;
	const bannerHtmlOverride =
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType));

	res.render(currentPage, { bannerHtmlOverride });
};

const postListOfDocuments = async (req, res) => {
	const { body } = req;
	const { errors = {} } = body;

	try {
		if (req.body['save-and-return'] !== '') {
			const appeal = req.session.appeal;

			const lpa = await getDepartmentFromId(appeal.lpaCode);
			const lpaCode = lpa.lpaCode ?? (await getLPAById(lpa.id)).lpaCode; // fallback to lookup in case cached lpa doesn't have code

			const usingV2Form = await isFeatureActive(FLAG.S78_APPEAL_FORM_V2, lpaCode);

			// v1
			if (!usingV2Form) {
				return res.redirect(`/${TASK_LIST}`);
			}

			// v2
			const appealSubmission = await req.appealsApiClient.createAppellantSubmission({
				appealId: appeal.appealSqlId,
				LPACode: lpaCode,
				appealTypeCode: CASE_TYPES.S78.processCode,
				applicationDecisionDate: appeal.decisionDate,
				applicationReference: appeal.planningApplicationNumber,
				applicationDecision: appeal.eligibility.applicationDecision,
				typeOfPlanningApplication: appeal.typeOfPlanningApplication
			});

			await deleteAppeal(appeal.id);
			req.session.appeal = null;

			return res.redirect(`${baseS78SubmissionUrl}/${taskListUrl}?id=${appealSubmission.id}`);
		}

		return await postSaveAndReturn(req, res);
	} catch (e) {
		logger.error(e);
		return res.render(currentPage, {
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
	}
};

module.exports = {
	getListOfDocuments,
	postListOfDocuments
};
