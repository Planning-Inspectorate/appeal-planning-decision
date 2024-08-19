const { questions } = require('../questions');
const { Journey } = require('../journey');
const { Section } = require('../section');
const config = require('../../config');
// const {
// 	questionHasAnswerBuilder,
// 	questionsHaveAnswersBuilder
// } = require('../dynamic-components/utils/question-has-answer');

const baseS78StatementUrl = '/manage-appeals/appeal-statement';
const s78JourneyTemplate = 'statement-template.njk';
const listingPageViewPath = 'dynamic-components/task-list/statement';
const journeyTitle = 'Manage your appeals';

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 */

/**
 * A Journey for LPAs responding to a S78 appeal
 * @class
 */
class S78LpaStatementJourney extends Journey {
	/**
	 * creates an instance of a S78 Journey
	 * @param {JourneyResponse} response - an object that handles the response for this journey (needs to always be passed in as it contains the journey url segment)
	 */
	constructor(response) {
		super({
			baseUrl: `${baseS78StatementUrl}/${encodeURIComponent(response.referenceId)}`,
			response: response,
			journeyTemplate: s78JourneyTemplate,
			listingPageViewPath: listingPageViewPath,
			journeyTitle: journeyTitle
		});

		// const questionHasAnswer = questionHasAnswerBuilder(response);
		// const questionsHaveAnswers = questionsHaveAnswersBuilder(response);

		this.sections.push(
			new Section('Appeal statement', config.dynamicForms.DEFAULT_SECTION).addQuestion(
				questions.lpaStatement
			)
		);
	}
}

module.exports = { S78LpaStatementJourney, baseS78StatementUrl };
