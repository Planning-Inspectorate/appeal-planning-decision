const { questions } = require('./questions');
const { Journey } = require('../journey');
const { Section } = require('../section');

const baseHASUrl = '/manage-appeals/questionnaire';

/**
 * @typedef {import('../journey-response').JourneyResponse} JourneyResponse
 */

/**
 * A Journey for LPA's responding to a HAS appeal
 * @class
 */
class HasJourney extends Journey {
	/**
	 * creates an instance of a HAS Journey
	 * @param {JourneyResponse} response - an onject that handles the response for this journey (needs to always be passed in as it contains the journey url segment)
	 */
	constructor(response) {
		super(`${baseHASUrl}/${encodeURIComponent(response.referenceId)}`, response);

		this.sections.push(
			new Section('Constraints, designations and other issues', 'constraints')
				.addQuestion(questions.appealTypeAppropriate)
				.addQuestion(questions.listedBuildingCheck)
				.addQuestion(questions.listedBuildingNumber)
				.withCondition(
					response.answers && response.answers[questions.listedBuildingCheck.fieldName] == 'yes'
				)
				.addQuestion(questions.conservationArea)
				.addQuestion(questions.conservationAreaUpload)
				.withCondition(
					response.answers && response.answers[questions.conservationArea.fieldName] == 'yes'
				)
				// .addQuestion(questions.listedBuildingDetail)
				// .withCondition(response.answers[questions.listedBuildingCheck.fieldName] == 'yes')
				// .addQuestion(questions.listedBuildingDetailList)
				// .withCondition(response.answers[questions.listedBuildingCheck.fieldName] == 'yes')

				// .addQuestion(questions.conservationAreaUpload)
				// .withCondition(response.answers[questions.conservationArea.fieldName] == 'yes')
				.addQuestion(questions.greenBelt),
			new Section('Notifying people about the application', 'notification')
				.addQuestion(questions.whoWasNotified)
				.addQuestion(questions.howYouNotifiedPeople)
				.addQuestion(questions.displaySiteNotice)
				.addQuestion(questions.lettersToNeighbours)
				.addQuestion(questions.pressAdvert)
				.addQuestion(questions.uploadLetters),
			// .addQuestion(questions.siteNoticeUpload)
			// .withCondition(
			// 	(response.answers[questions.howYouNotifiedPeople.fieldName] ?? '').includes('Site notice')
			// )
			// .addQuestion(questions.lettersToNeighboursUpload)
			// .withCondition(
			// 	(response.answers[questions.howYouNotifiedPeople.fieldName] ?? '').includes(
			// 		'Letters to neighbours'
			// 	)
			// )
			// .addQuestion(questions.advertisementUpload)
			// .withCondition(
			// 	(response.answers[questions.howYouNotifiedPeople.fieldName] ?? '').includes(
			// 		'Advertisement'
			// 	)
			// )
			new Section('Consultation responses and representations', 'consultation').addQuestion(
				questions.representationsFromOthers
			),
			new Section("Planning officer's report and supplementary documents", 'officer').addQuestion(
				questions.planningOfficersUpload
			),
			new Section('Site access', 'access')
				.addQuestion(questions.accessForInspection)
				.addQuestion(questions.neighbouringSite)
				.addQuestion(questions.potentialSafetyRisks),
			new Section('Appeal process', 'process')
				.addQuestion(questions.appealsNearSite)
				.addQuestion(questions.addNewConditions),
			new Section('Submit', 'submit')
		);
	}
}

module.exports = { HasJourney, baseHASUrl };
