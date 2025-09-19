const { getQuestions } = require('../questions');
const questions = getQuestions();
const { Section } = require('@pins/dynamic-forms/src/section');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { QUESTION_VARIABLES } = require('@pins/common/src/dynamic-forms/question-variables');
const {
	CASE_TYPES: { ADVERTS, CAS_ADVERTS }
} = require('@pins/common/src/database/data-static');

/**
 * @typedef {import('@pins/dynamic-forms/src/journey-response').JourneyResponse} JourneyResponse
 * @typedef {Omit<ConstructorParameters<typeof import('@pins/dynamic-forms/src/journey').Journey>[0], 'response'>} JourneyParameters
 */

/**
 * @param {JourneyResponse} response
 * @returns {Section[]}
 */
const makeSections = (response) => [
	new Section('Constraints, designations and other issues', 'constraints')
		.addQuestion(questions.appealTypeAppropriate)
		.withVariables({
			[QUESTION_VARIABLES.APPEAL_TYPE]:
				response.journeyId === JOURNEY_TYPES.ADVERTS_QUESTIONNAIRE.id
					? ADVERTS.type.toLowerCase()
					: CAS_ADVERTS.type.toLowerCase()
		})
		.addQuestion(questions.isSiteInAreaOfSpecialControlAdverts),
	new Section(
		"Planning officer's report and supporting documents",
		'planning-officer-report'
	).addQuestion(questions.wasApplicationRefusedDueToHighwayOrTraffic),
	new Section('Appeal process', 'appeal-process').addQuestion(questions.addNewConditions)
];

const baseAdvertsMinorUrl = '/manage-appeals/questionnaire';

/**
 * @param {JourneyResponse} response
 * @returns {string}
 */
const makeBaseUrl = (response) =>
	`${baseAdvertsMinorUrl}/${encodeURIComponent(response.referenceId)}`;

/** @type {JourneyParameters} */
const casAdvertsParams = {
	journeyId: JOURNEY_TYPES.CAS_ADVERTS_QUESTIONNAIRE.id,
	makeSections,
	journeyTemplate: 'questionnaire-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/questionnaire',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Manage your appeals',
	makeBaseUrl
};
/** @type {JourneyParameters} */
const advertsParams = {
	journeyId: JOURNEY_TYPES.ADVERTS_QUESTIONNAIRE.id,
	makeSections,
	journeyTemplate: 'questionnaire-template.njk',
	listingPageViewPath: 'dynamic-components/task-list/questionnaire',
	informationPageViewPath: 'dynamic-components/submission-information/index',
	journeyTitle: 'Manage your appeals',
	makeBaseUrl
};

module.exports = {
	adverts: {
		...advertsParams,
		baseAdvertsMinorUrl
	},
	casAdverts: {
		...casAdvertsParams,
		baseAdvertsMinorUrl
	}
};
