const { getQuestions } = require('../questions');
const { Section } = require('@pins/dynamic-forms/src/section');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { QUESTION_VARIABLES } = require('@pins/common/src/dynamic-forms/question-variables');
const {
	CASE_TYPES: { LDC }
} = require('@pins/common/src/database/data-static');
const {
	mapAppealTypeToDisplayText,
	mapAppealTypeToDisplayTextWithAnOrA
} = require('@pins/common/src/appeal-type-to-display-text');
const {
	questionHasAnswer,
	questionsHaveAnswers
} = require('@pins/dynamic-forms/src/dynamic-components/utils/question-has-answer');
const { APPEAL_CASE_PROCEDURE } = require('@planning-inspectorate/data-model');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('@pins/dynamic-forms/src/journey').Journey>[0], 'response'>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const makeSections = (response) => {
	const questions = getQuestions(response);
	return [
		new Section('Constraints, designations and other issues', 'constraints')
			.addQuestion(questions.appealTypeAppropriate)
			.withVariables({
				[QUESTION_VARIABLES.APPEAL_TYPE_WITH_AN_OR_A]: mapAppealTypeToDisplayTextWithAnOrA(LDC),
				[QUESTION_VARIABLES.APPEAL_TYPE]: mapAppealTypeToDisplayText(LDC)
			})
			.addQuestion(questions.lawfulDevelopmentCertificateTypeLPAQ)
			.addQuestion(questions.planningCondition)
			.addQuestion(questions.planningPermissionUpload)
			.withCondition(() => questionHasAnswer(response, questions.planningCondition, 'yes'))
			.addQuestion(questions.enforcementNoticeDateApplication)
			.addQuestion(questions.enforcementNoticeDateApplicationUpload)
			.withCondition(() =>
				questionHasAnswer(response, questions.enforcementNoticeDateApplication, 'yes')
			)
			.addQuestion(questions.relatedApplications)
			.addQuestion(questions.relatedApplicationsUpload)
			.withCondition(() => questionHasAnswer(response, questions.relatedApplications, 'yes'))
			.addQuestion(questions.appealInvalid),
		new Section("Planning officer's report and supporting documents", 'planning-officer-report')
			.addQuestion(questions.planningOfficersReport)
			.addQuestion(questions.planningOfficersReportUpload)
			.withCondition(() => questionHasAnswer(response, questions.planningOfficersReport, 'yes'))
			.addQuestion(questions.communityInfrastructureLevy)
			.addQuestion(questions.communityInfrastructureLevyUpload)
			.withCondition(() =>
				questionHasAnswer(response, questions.communityInfrastructureLevy, 'yes')
			)
			.addQuestion(questions.communityInfrastructureLevyAdopted)
			.withCondition(() =>
				questionHasAnswer(response, questions.communityInfrastructureLevy, 'yes')
			)
			.addQuestion(questions.communityInfrastructureLevyAdoptedDate)
			.withCondition(() =>
				questionsHaveAnswers(response, [
					[questions.communityInfrastructureLevy, 'yes'],
					[questions.communityInfrastructureLevyAdopted, 'yes']
				])
			)
			.addQuestion(questions.communityInfrastructureLevyAdoptDate)
			.withCondition(() =>
				questionsHaveAnswers(response, [
					[questions.communityInfrastructureLevy, 'yes'],
					[questions.communityInfrastructureLevyAdopted, 'no']
				])
			)
			.addQuestion(questions.otherRelevantMatters)
			.addQuestion(questions.otherRelevantMattersUpload)
			.withCondition(() => questionHasAnswer(response, questions.otherRelevantMatters, 'yes')),
		new Section('Site access', 'site-access')
			.addQuestion(questions.accessForInspection)
			.addQuestion(questions.neighbouringSite)
			.addQuestion(questions.neighbouringSitesToBeVisited)
			.withCondition(() => questionHasAnswer(response, questions.neighbouringSite, 'yes'))
			.addQuestion(questions.potentialSafetyRisks),
		new Section('Appeal process', 'appeal-process')
			.addQuestion(questions.procedureType)
			.addQuestion(questions.whyInquiry)
			.withCondition(() =>
				questionHasAnswer(response, questions.procedureType, APPEAL_CASE_PROCEDURE.INQUIRY)
			)
			.addQuestion(questions.whyHearing)
			.withCondition(() =>
				questionHasAnswer(response, questions.procedureType, APPEAL_CASE_PROCEDURE.HEARING)
			)
			.addQuestion(questions.appealsNearSite)
			.addQuestion(questions.nearbyAppeals)
			.withCondition(() => questionHasAnswer(response, questions.appealsNearSite, 'yes'))
	];
};

const baseLdcSubmissionUrl = '/manage-appeals/questionnaire';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseLdcSubmissionUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const params = {
	journeyId: JOURNEY_TYPES.LDC_QUESTIONNAIRE.id,
	makeSections,
	journeyTemplate: 'questionnaire-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/questionnaire',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Manage your appeals',
	makeBaseUrl
};

module.exports = { ...params, baseLdcSubmissionUrl };
