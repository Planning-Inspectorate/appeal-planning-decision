const { questions } = require('../questions');
const { Journey } = require('../journey');
const { Section } = require('../section');
const { checkAnswerIncludes } = require('../dynamic-components/utils/check-answer-includes');

const baseS78Url = '/manage-appeals/questionnaire';
const s78JourneyTemplate = 'questionnaire-template.njk';
const listingPageViewPath = 'dynamic-components/task-list/questionnaire';
const journeyTitle = 'Manage your appeals';

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 */

/**
 * A Journey for LPAs responding to a S78 appeal
 * @class
 */
class S78Journey extends Journey {
	/**
	 * creates an instance of a S78 Journey
	 * @param {JourneyResponse} response - an object that handles the response for this journey (needs to always be passed in as it contains the journey url segment)
	 */
	constructor(response) {
		super(
			`${baseS78Url}/${encodeURIComponent(response.referenceId)}`,
			response,
			s78JourneyTemplate,
			listingPageViewPath,
			journeyTitle
		);

		this.sections.push(
			new Section('Constraints, designations and other issues', 'constraints').addQuestion(
				questions.listedBuildingCheck
			),
			new Section('Environmental impact assessment', 'environmental-impact'),
			new Section('Notifying relevant parties of the application', 'notified')
				.addQuestion(questions.howYouNotifiedPeople)
				.addQuestion(questions.uploadSiteNotice)
				.withCondition(
					response.answers &&
						checkAnswerIncludes(
							response.answers[questions.howYouNotifiedPeople.fieldName],
							'site-notice'
						)
				),
			new Section('Consultation responses and representations', 'consultation'),
			new Section('Planning officer’s report and relevant policies', 'planning-officer-report')
				.addQuestion(questions.emergingPlan)
				.addQuestion(questions.communityInfrastructureLevy),
			new Section('Site access', 'site-access').addQuestion(questions.neighbouringSite),
			new Section('Appeal process', 'appeal-process').addQuestion(questions.appealsNearSite)
		);
	}
}

module.exports = { S78Journey, baseS78Url };
