// common controllers for dynamic forms
const fs = require('fs');
const path = require('path');
const { SECTION_STATUS } = require('./section');
const logger = require('../lib/logger');
const ListAddMoreQuestion = require('./dynamic-components/list-add-more/question');
const questionUtils = require('./dynamic-components/utils/question-utils');
const {
	formatBeforeYouStartSection,
	formatQuestionnaireAppealInformationSection
} = require('./dynamic-components/utils/submission-information-utils');
const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const { getDepartmentFromId } = require('../services/department.service');
const { getLPAById, deleteAppeal } = require('../lib/appeals-api-wrapper');
const { formatDateForDisplay } = require('@pins/common/src/lib/format-date');
const { APPEAL_CASE_STAGE } = require('pins-data-model');
const { PassThrough } = require('node:stream');
const buildZipFilename = require('#lib/build-zip-filename');
const { getUserFromSession } = require('../services/user.service');
const { storePdfQuestionnaireSubmission } = require('../services/pdf.service');
const config = require('../config');
const {
	typeOfPlanningApplicationToAppealTypeMapper
} = require('#lib/full-appeal/map-planning-application');

const appealTypeToDetails = {
	[CASE_TYPES.HAS.id.toString()]: {
		appealTypeCode: CASE_TYPES.HAS.processCode,
		taskListUrlStub: 'householder'
	},
	[CASE_TYPES.S78.id.toString()]: {
		appealTypeCode: CASE_TYPES.S78.processCode,
		taskListUrlStub: 'full-planning'
	},
	[CASE_TYPES.S20.id.toString()]: {
		appealTypeCode: CASE_TYPES.S20.processCode,
		taskListUrlStub: 'listed-building'
	}
};

/**
 * @typedef {import('@pins/common/src/dynamic-forms/journey-types').JourneyType} JourneyType
 * @typedef {import('./journey').Journey} Journey
 * @typedef {import('./journey-response').JourneyResponse} JourneyResponse
 * @typedef {import('./question')} Question
 * @typedef {import('./section').Section} Section
 */

/**
 * @typedef {Object} SectionView
 * @property {string} heading
 * @property {string} status
 * @property {Object} list
 * @property {Array.<RowView>} list.rows
 */

/**
 * @typedef {Object} RowView
 * @property {{ text: string }} key
 * @property {{ text: string } | { html: string }} value
 * @property {{ items: ActionView[] }} [actions]
 */

/**
 * @typedef {Object} ActionView
 * @property {string} href
 * @property {string} text
 * @property {string} [visuallyHiddenText]
 */

/**
 * build a view model for a section in the journey overview
 * @param {string} name
 * @param {string} [status]
 * @returns {SectionView} a representation of a section
 */
function buildSectionViewModel(name, status = '') {
	return {
		heading: name,
		status: status,
		list: {
			rows: []
		}
	};
}

/**
 * build a view model for a row in the journey overview
 * @param {string} key
 * @param {string} value
 * @param {ActionView} action
 * @returns {RowView} a representation of a row
 */
function buildSectionRowViewModel(key, value, action) {
	return {
		key: {
			text: key
		},
		value: {
			html: value
		},
		actions: {
			items: [action]
		}
	};
}

/**
 * build a view model for a row in the journey overview
 * @param {string} key
 * @param {string} value
 * @returns {RowView} a representation of a row
 */
function buildInformationSectionRowViewModel(key, value) {
	return {
		key: {
			text: key,
			classes: 'govuk-!-width-one-half'
		},
		value: {
			html: value
		}
	};
}

/**
 * build summary list of journey sections, questions and answers
 * @param {Journey} journey
 * @param {JourneyResponse} journeyResponse
 */
function buildSummaryListData(journey, journeyResponse) {
	const summaryListData = {
		sections: []
	};

	for (const section of journey.sections) {
		const sectionView = buildSectionViewModel(section.name);

		// add questions
		for (const question of section.questions) {
			// don't show question on tasklist if set to false
			if (question.taskList === false) {
				continue;
			}
			// don't show question on tasklist if it's hidden from journey
			if (!question.shouldDisplay(journeyResponse)) {
				continue;
			}

			const answers = journey.response?.answers;
			let answer = answers[question.fieldName];
			const conditionalAnswer = questionUtils.getConditionalAnswer(answers, question, answer);
			if (conditionalAnswer) {
				answer = {
					value: answer,
					conditional: conditionalAnswer
				};
			}
			const rows = question.formatAnswerForSummary(section.segment, journey, answer);
			rows.forEach((row) => {
				let viewModelRow = buildInformationSectionRowViewModel(row.key, row.value);
				sectionView.list.rows.push(viewModelRow);
			});
		}

		summaryListData.sections.push(sectionView);
	}

	return summaryListData;
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {string} pageCaption
 * @param {object} viewData
 */
exports.list = async (req, res, pageCaption, viewData) => {
	//render check your answers view
	const { journey, journeyResponse } = res.locals;

	const summaryListData = {
		sections: [],
		completedSectionCount: 0
	};

	for (const section of journey.sections) {
		const status = section.getStatus(journeyResponse);
		const sectionView = buildSectionViewModel(section.name, status);

		// update completed count
		if (status === SECTION_STATUS.COMPLETE) {
			summaryListData.completedSectionCount++;
		}

		// add questions
		for (const question of section.questions) {
			// don't show question on tasklist if set to false
			if (question.taskList === false) {
				continue;
			}

			if (!question.shouldDisplay(journeyResponse)) {
				continue;
			}

			const answers = journey.response?.answers;
			let answer = answers[question.fieldName];
			const conditionalAnswer = questionUtils.getConditionalAnswer(answers, question, answer);
			if (conditionalAnswer) {
				answer = {
					value: answer,
					conditional: conditionalAnswer
				};
			}
			const rows = question.formatAnswerForSummary(section.segment, journey, answer);
			rows.forEach((row) => {
				let viewModelRow = buildSectionRowViewModel(row.key, row.value, row.action);
				sectionView.list.rows.push(viewModelRow);
			});
		}

		summaryListData.sections.push(sectionView);
	}

	return res.render(journey.listingPageViewPath, {
		...viewData,
		pageCaption,
		summaryListData,
		journeyComplete: journey.isComplete(),
		layoutTemplate: journey.journeyTemplate,
		journeyTitle: journey.journeyTitle,
		bannerHtmlOverride: journey.bannerHtmlOverride
	});
};

/**
 * @type {import('express').Handler}
 */
exports.question = async (req, res) => {
	//render an individual question
	const { section, question } = req.params;
	const { journey } = res.locals;

	const sectionObj = journey.getSection(section);
	const questionObj = journey.getQuestionBySectionAndName(section, question);

	if (!questionObj || !sectionObj) {
		return res.redirect(journey.taskListUrl);
	}

	const sessionBackLink = getJourneyEntryFromSession(req, journey);

	const viewModel = questionObj.prepQuestionForRendering({
		section: sectionObj,
		journey,
		sessionBackLink
	});
	return questionObj.renderAction(res, viewModel);
};

/**
 * @type {import('express').Handler}
 */
exports.save = async (req, res) => {
	//save the response
	const { section, question } = req.params;
	const { journey, journeyResponse } = res.locals;

	const sectionObj = journey.getSection(section);
	const questionObj = journey.getQuestionBySectionAndName(section, question);

	if (!questionObj || !sectionObj) {
		return res.redirect(journey.taskListUrl);
	}

	try {
		return await questionObj.saveAction(req, res, journey, sectionObj, journeyResponse);
	} catch (err) {
		logger.error(err);

		const viewModel = questionObj.prepQuestionForRendering({
			section: sectionObj,
			journey,
			customViewData: {
				errorSummary: [{ text: err.toString(), href: '#' }]
			}
		});
		return questionObj.renderAction(res, viewModel);
	}
};

/**
 * @type {import('express').Handler}
 */
exports.remove = async (req, res) => {
	//save the response
	const { section, question, answerId } = req.params;
	const { journey, journeyResponse } = res.locals;

	const sectionObj = journey.getSection(section);
	const questionObj = journey.getQuestionBySectionAndName(section, question);

	if (!questionObj || !sectionObj) {
		return res.redirect(journey.taskListUrl);
	}

	try {
		if (questionObj instanceof ListAddMoreQuestion) {
			const goBack = await questionObj.removeAction(req, journeyResponse, answerId);
			if (goBack === true) {
				const next =
					journey.getNextQuestionUrl(section, questionObj.fieldName, goBack) || journey.taskListUrl;
				return res.redirect(next);
			}
			return res.redirect(journey.getCurrentQuestionUrl(section, question));
		}

		throw new Error(`Cannot remove answer for ${section}/${question}`);
	} catch (err) {
		logger.error(err);

		const viewModel = questionObj.prepQuestionForRendering({
			section: sectionObj,
			journey,
			customViewData: {
				errorSummary: [{ text: 'Failed to remove answer', href: '#' }]
			}
		});

		return questionObj.renderAction(res, viewModel);
	}
};

// Submit LPA Questionnaire
/**
 * @type {import('express').Handler}
 */
exports.submit = async (req, res) => {
	const { journey, journeyResponse } = res.locals;
	const referenceId = res.locals.journeyResponse.referenceId;

	const journeyUrl = (journeyId) => {
		if (journeyId === 'has-questionnaire') {
			return 'householder';
		} else if (journeyId === 's78-questionnaire') {
			return 'full-planning';
		} else return '';
	};

	if (!journey.isComplete()) {
		res.sendStatus(400);
		return;
	}

	await req.appealsApiClient.submitLPAQuestionnaire(referenceId);

	const storedPdf = await storePdfQuestionnaireSubmission({
		submissionJourney: journey,
		cookieString: req.headers.cookie,
		appealTypeUrl: journeyUrl(journeyResponse.journeyId)
	});

	await req.appealsApiClient.patchLPAQuestionnaire(referenceId, { submissionPdfId: storedPdf.id });

	return res.redirect(
		'/manage-appeals/' +
			`${journeyUrl(journeyResponse.journeyId)}/` +
			encodeURIComponent(referenceId) +
			'/questionnaire-submitted/'
	);
};

// Submit LPA Statement
/**
 * @type {import('express').Handler}
 */
exports.submitLpaStatement = async (req, res) => {
	const { journey } = res.locals;
	const referenceId = res.locals.journeyResponse.referenceId;

	if (!journey.isComplete()) {
		res.sendStatus(400);
		return;
	}

	await req.appealsApiClient.submitLPAStatement(referenceId);

	return res.redirect(
		`/manage-appeals/appeal-statement/${referenceId}/submitted-appeal-statement/`
	);
};

// LPA submission information (for PDF generation)
/**
 * @type {import('express').Handler}
 */
exports.lpaQuestionnaireSubmissionInformation = async (req, res) => {
	const { journey, journeyResponse } = res.locals;

	if (!journey.isComplete() || !journey.response.answers.submitted) {
		// return error message and redirect
		return res.status(400).render('./error/not-found.njk');
	}
	const user = getUserFromSession(req);
	const encodedReferenceId = encodeURIComponent(journeyResponse.referenceId);

	let appealData;
	try {
		appealData = await req.appealsApiClient.getUsersAppealCase({
			caseReference: encodedReferenceId,
			userId: user.id,
			role: LPA_USER_ROLE
		});
	} catch (err) {
		logger.error({ err }, `unable to find appeal ${journeyResponse.referenceId}`);
		return res.status(400).render('./error/not-found.njk');
	}

	const summaryListData = buildSummaryListData(journey, journeyResponse);
	const submissionDate = formatDateForDisplay(new Date(), { format: 'd MMMM yyyy' });
	const appealInformationSection = formatQuestionnaireAppealInformationSection(
		appealData,
		LPA_USER_ROLE
	);
	summaryListData.sections.unshift(appealInformationSection);

	const informationPageType = 'Questionnaire';
	const pageHeading = 'Appeal questionnaire';
	const pageCaption = 'Appeal ' + journeyResponse.referenceId;

	return res.render(journey.informationPageViewPath, {
		informationPageType,
		pageHeading,
		pageCaption,
		summaryListData,
		submissionDate,
		layoutTemplate: journey.journeyTemplate,
		journeyTitle: journey.journeyTitle,
		displayCookieBanner: false
	});
};

// Before You Start documents list
/**
 * @type {import('express').Handler}
 */
exports.appellantBYSListOfDocuments = (req, res) => {
	const appeal = req.session.appeal;
	const appealType =
		typeOfPlanningApplicationToAppealTypeMapper[req.session.appeal.typeOfPlanningApplication];
	const bannerHtmlOverride =
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(appealType));

	const usingV2Form = true;

	switch (appeal.appealType) {
		case APPEAL_ID.HOUSEHOLDER:
			return res.render('appeal-householder-decision/list-of-documents', {
				usingV2Form,
				bannerHtmlOverride
			});
		case APPEAL_ID.PLANNING_SECTION_78:
		case APPEAL_ID.PLANNING_LISTED_BUILDING:
			return res.render('full-appeal/submit-appeal/list-of-documents', {
				usingV2Form,
				bannerHtmlOverride
			});
		default:
			return res.render('./error/not-found.njk');
	}
};

// Generate appellant submission
/**
 * @type {import('express').Handler}
 */
exports.appellantStartAppeal = async (req, res) => {
	const appeal = req.session.appeal;
	const appealType = appeal.appealType;

	const lpa = await getDepartmentFromId(appeal.lpaCode);
	const lpaCode = lpa.lpaCode ?? (await getLPAById(lpa.id)).lpaCode; // fallback to lookup in case cached lpa doesn't have code

	const appealTypeDetails = appealTypeToDetails[appealType];

	// todo: convert before sending
	const appealSubmission = await req.appealsApiClient.createAppellantSubmission({
		appealId: appeal.appealSqlId,
		LPACode: lpaCode,
		appealTypeCode: appealTypeDetails.appealTypeCode,
		applicationDecisionDate: appeal.decisionDate,
		applicationReference: appeal.planningApplicationNumber,
		applicationDecision: appeal.eligibility.applicationDecision,
		typeOfPlanningApplication: appeal.typeOfPlanningApplication
	});

	await deleteAppeal(appeal.id);
	req.session.appeal = null;

	await req.appealsApiClient.patchAppealById(appeal.appealSqlId, {
		legacyAppealSubmissionId: null,
		legacyAppealSubmissionDecisionDate: null,
		legacyAppealSubmissionState: null
	});

	return res.redirect(
		`/appeals/${appealTypeDetails.taskListUrlStub}/appeal-form/your-appeal?id=${appealSubmission.id}`
	);
};

// Submit an appeal
/**
 * @type {import('express').Handler}
 */
exports.submitAppellantSubmission = async (req, res) => {
	const { journey, journeyResponse } = res.locals;
	const id = res.locals.journeyResponse.referenceId;

	const journeyUrl = (journeyId) => {
		if (journeyId === 'has-appeal-form') {
			return 'householder';
		} else if (journeyId === 's78-appeal-form') {
			return 'full-planning';
		} else if (journeyId === 's20-appeal-form') {
			return 'listed-building';
		} else return '';
	};

	if (!journey.isComplete()) {
		res.sendStatus(400).render('./error/not-found.njk');
		return;
	}

	await req.appealsApiClient.submitAppellantSubmission(id);

	return res.redirect(
		'/appeals/' +
			journeyUrl(journeyResponse.journeyId) +
			'/submit/submitted?id=' +
			encodeURIComponent(id)
	);
};

/**
 * @type {import('express').Handler}
 */
exports.appellantSubmissionDeclaration = async (req, res) => {
	const { journey } = res.locals;

	if (!journey.isComplete()) {
		// return error message and redirect
		return res.status(400).render('./error/not-found.njk');
	}

	return res.render('./dynamic-components/submission-declaration/index', {
		layoutTemplate: journey.journeyTemplate,
		bannerHtmlOverride: journey.bannerHtmlOverride
	});
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.appellantSubmissionInformation = async (req, res) => {
	const { journey, journeyResponse } = res.locals;
	if (!journey.isComplete() || !journey.response.answers.submitted) {
		// return error message and redirect
		return res.status(400).render('./error/not-found.njk');
	}

	const summaryListData = buildSummaryListData(journey, journeyResponse);

	const beforeYouStartSection = await formatBeforeYouStartSection(journey.response.answers);

	summaryListData.sections.unshift(beforeYouStartSection);

	const css = fs.readFileSync(path.resolve(__dirname, '../public/stylesheets/main.css'), 'utf8');

	const submissionDate = formatDateForDisplay(new Date(), { format: 'd MMMM yyyy' });

	const { caseReference } = await req.appealsApiClient.getAppellantSubmissionCaseReference(
		journey.response.answers.id
	);

	const informationPageType = 'Appeal';
	const pageHeading = informationPageType + ' ' + caseReference;

	return res.render(journey.informationPageViewPath, {
		informationPageType,
		pageHeading,
		summaryListData,
		submissionDate,
		layoutTemplate: journey.journeyTemplate,
		journeyTitle: journey.journeyTitle,
		css,
		displayCookieBanner: false,
		bannerHtmlOverride: journey.bannerHtmlOverride
	});
};

/**
 * @type {import('express').Handler}
 */
exports.lpaSubmitted = async (req, res) => {
	const { journey } = res.locals;
	if (!journey.isComplete()) {
		// return error message and redirect
		return res.status(400).render('./error/not-found.njk');
	}

	const baseUrl = req.originalUrl.substring(
		0,
		req.originalUrl.lastIndexOf('/questionnaire-submitted')
	);
	const zipDownloadUrl =
		baseUrl + `/download/submission/documents/${APPEAL_CASE_STAGE.LPA_QUESTIONNAIRE}`;
	return res.render('./dynamic-components/submission-screen/lpa', { zipDownloadUrl });
};

/**
 * @type {import('express').Handler}
 */
exports.appellantSubmitted = async (req, res) => {
	const { journey } = res.locals;
	if (!journey.isComplete()) {
		// return error message and redirect
		return res.status(400).render('./error/not-found.njk');
	}

	return res.render('./dynamic-components/submission-screen/appellant', {
		caseReference: journey.response.answers.applicationReference,
		bannerHtmlOverride: journey.bannerHtmlOverride,
		feedbackLinkUrl: config.getAppealTypeFeedbackUrl(journey.response.answers.appealTypeCode)
	});
};

/**
 * @type {import('express').Handler}
 */
exports.appealStatementSubmitted = async (req, res) => {
	const { journey } = res.locals;
	if (!journey.isComplete()) {
		// return error message and redirect
		return res.render('./error/not-found.njk');
	}

	return res.render('./dynamic-components/submission-screen/appeal-statement', {});
};

/**
 * @type {import('express').Handler}
 */
exports.submitAppellantFinalComment = async (req, res) => {
	const { journey } = res.locals;
	const caseReference = journey.response.answers.caseReference;

	if (!journey.isComplete()) {
		res.render('./error/not-found.njk');
		return;
	}

	await req.appealsApiClient.submitAppellantFinalCommentSubmission(caseReference);

	return res.redirect(`/appeals/final-comments/${caseReference}/submitted`);
};

/**
 * @type {import('express').Handler}
 */
exports.appellantFinalCommentSubmitted = async (req, res) => {
	const { journey } = res.locals;
	const caseReference = journey.response.answers.caseReference;

	if (!journey.isComplete()) {
		// return error message and redirect
		return res.render('./error/not-found.njk');
	}

	return res.render('./dynamic-components/submission-screen/appellant-final-comment', {
		caseReference,
		bannerHtmlOverride: journey.bannerHtmlOverride,
		feedbackLinkUrl: config.getAppealTypeFeedbackUrl(journey.response.answers.appealTypeCode)
	});
};

/**
 * @type {import('express').Handler}
 */
exports.submitAppellantProofEvidence = async (req, res) => {
	const { journey } = res.locals;
	const caseReference = journey.response.answers.caseReference;

	if (!journey.isComplete()) {
		res.render('./error/not-found.njk');
		return;
	}

	await req.appealsApiClient.submitAppellantProofEvidenceSubmission(caseReference);

	return res.redirect(`/appeals/proof-evidence/${caseReference}/submitted-proof-evidence`);
};

/**
 * @type {import('express').Handler}
 */
exports.appellantProofEvidenceSubmitted = async (req, res) => {
	const { journey } = res.locals;
	const caseReference = journey.response.answers.caseReference;

	if (!journey.isComplete()) {
		// return error message and redirect
		return res.render('./error/not-found.njk');
	}

	return res.render('./dynamic-components/submission-screen/appellant-proof-evidence', {
		caseReference,
		dashboardUrl: '/appeals/your-appeals',
		bannerHtmlOverride: journey.bannerHtmlOverride,
		feedbackLinkUrl: config.getAppealTypeFeedbackUrl(journey.response.answers.appealTypeCode)
	});
};

/**
 * @type {import('express').Handler}
 */
exports.submitRule6ProofEvidence = async (req, res) => {
	const { journey } = res.locals;
	const caseReference = journey.response.answers.caseReference;

	if (!journey.isComplete()) {
		res.render('./error/not-found.njk');
		return;
	}

	await req.appealsApiClient.submitRule6ProofOfEvidenceSubmission(caseReference);

	return res.redirect(`/rule-6/proof-evidence/${caseReference}/submitted-proof-evidence`);
};

/**
 * @type {import('express').Handler}
 */
exports.rule6ProofEvidenceSubmitted = async (req, res) => {
	const { journey } = res.locals;
	const caseReference = journey.response.answers.caseReference;

	if (!journey.isComplete()) {
		// return error message and redirect
		return res.render('./error/not-found.njk');
	}

	return res.render('./dynamic-components/submission-screen/appellant-proof-evidence', {
		caseReference,
		dashboardUrl: '/rule-6/your-appeals',
		bannerHtmlOverride: journey.bannerHtmlOverride,
		feedbackLinkUrl: config.getAppealTypeFeedbackUrl(journey.response.answers.appealTypeCode)
	});
};

/**
 * @type {import('express').Handler}
 */
exports.submitRule6Statement = async (req, res) => {
	const { journey } = res.locals;
	const caseReference = journey.response.answers.caseReference;

	if (!journey.isComplete()) {
		res.render('./error/not-found.njk');
		return;
	}

	await req.appealsApiClient.submitRule6StatementSubmission(caseReference);

	return res.redirect(`/rule-6/appeal-statement/${caseReference}/submitted-appeal-statement`);
};

/**
 * @type {import('express').Handler}
 */
exports.rule6StatementSubmitted = async (req, res) => {
	const { journey } = res.locals;
	const caseReference = journey.response.answers.caseReference;

	if (!journey.isComplete()) {
		// return error message and redirect
		return res.render('./error/not-found.njk');
	}

	return res.render('./dynamic-components/submission-screen/rule-6-statement', {
		caseReference,
		bannerHtmlOverride: journey.bannerHtmlOverride,
		feedbackLinkUrl: config.getAppealTypeFeedbackUrl(journey.response.answers.appealTypeCode)
	});
};

/**
 * @type {import('express').Handler}
 */
exports.submitLpaFinalComment = async (req, res) => {
	const { journey } = res.locals;
	const caseReference = journey.response.answers.caseReference;

	if (!journey.isComplete()) {
		res.render('./error/not-found.njk');
		return;
	}

	await req.appealsApiClient.submitLPAFinalCommentSubmission(caseReference);

	return res.redirect(`/manage-appeals/final-comments/${caseReference}/submitted`);
};

/**
 * @type {import('express').Handler}
 */
exports.lpaFinalCommentSubmitted = async (req, res) => {
	const { journey } = res.locals;
	const caseReference = journey.response.answers.caseReference;

	if (!journey.isComplete()) {
		// return error message and redirect
		return res.render('./error/not-found.njk');
	}

	return res.render('./dynamic-components/submission-screen/lpa-final-comment', {
		caseReference
	});
};

/**
 * @type {import('express').Handler}
 */
exports.submitLpaProofEvidence = async (req, res) => {
	const { journey } = res.locals;
	const caseReference = journey.response.answers.caseReference;

	if (!journey.isComplete()) {
		res.render('./error/not-found.njk');
		return;
	}

	await req.appealsApiClient.submitLpaProofEvidenceSubmission(caseReference);

	return res.redirect(`/manage-appeals/proof-evidence/${caseReference}/submitted-proof-evidence`);
};

/**
 * @type {import('express').Handler}
 */
exports.lpaProofEvidenceSubmitted = async (req, res) => {
	const { journey } = res.locals;
	const caseReference = journey.response.answers.caseReference;

	if (!journey.isComplete()) {
		// return error message and redirect
		return res.render('./error/not-found.njk');
	}

	return res.render('./dynamic-components/submission-screen/lpa-proof-evidence', {
		caseReference
	});
};

/**
 * @type {import('express').Handler}
 */
exports.bulkDownloadSubmissionDocuments = async (req, res) => {
	const { referenceId, appealCaseStage, documentsLocation } = req.params;

	if (!appealCaseStage) {
		return res.status(404);
	}

	res.setHeader('content-type', 'application/zip');
	res.setHeader(
		'content-disposition',
		`attachment; filename=${buildZipFilename(referenceId, appealCaseStage)}`
	);

	const bufferStream = new PassThrough();

	bufferStream.end(
		await req.docsApiClient.getBulkDocumentsDownload(
			referenceId,
			appealCaseStage,
			documentsLocation
		)
	);

	bufferStream.pipe(res);

	return res.status(200);
};

/** @type {import('express').RequestHandler } */
exports.shortJourneyEntry = async (req, res) => {
	req.session.navigationHistory.shift();
	const { journey, journeyResponse } = res.locals;

	// store entry point to journey in session, for exit path
	setJourneyEntryOnSession(req, journey, req.session?.navigationHistory[0]);

	// if complete, go to first question
	if (journey.isComplete()) return res.redirect(journey.getFirstQuestionUrl());

	// otherwise, go to first unanswered question
	const firstUnansweredQuestionUrl = journey.getFirstUnansweredQuestionUrl(journeyResponse);
	if (firstUnansweredQuestionUrl) return res.redirect(firstUnansweredQuestionUrl);

	// fallback to task list
	return res.redirect(journey.taskListUrl);
};

/** @type {import('express').RequestHandler } */
exports.startJourneyFromBeginning = async (req, res) => {
	const { journey } = res.locals;

	// always go to the first question
	return res.redirect(journey.getFirstQuestionUrl());
};

/**
 * @param {import('express').Request} req
 * @param {Journey} journey
 * @param {string} [entryUrl]
 */
const setJourneyEntryOnSession = (req, journey, entryUrl) => {
	if (journey.baseUrl && entryUrl && !entryUrl.includes(journey.baseUrl)) {
		req.session.journeyEntry = {
			...req.session.journeyEntry,
			[journey.baseUrl]: entryUrl
		};
	}
};

/**
 * @param {import('express').Request} req
 * @param {Journey} journey
 * @returns {string}
 */
const getJourneyEntryFromSession = (req, journey) => {
	return req.session?.journeyEntry?.[journey.baseUrl];
};
