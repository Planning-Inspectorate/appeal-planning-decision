const RequiredFileUploadValidator = require('./validator/required-file-upload-validator');
const RequiredValidator = require('./validator/required-validator');

/**
 * @typedef {import('./question')} Question
 * @typedef {import('./journey-response').JourneyResponse} JourneyResponse
 */

/**
 * Defines a section for a questionnaire, a set of Questions
 * @class
 */
class Section {
	/**
	 * @type {string} - the display name of the section shown to user
	 */
	name;

	/**
	 * @type {string} - the unique url segment for the section
	 */
	segment;

	/**
	 * @type {Array.<Question>} - questions within the section
	 */
	questions = [];

	/**
	 * creates an instance of a section
	 * @param {string} name
	 * @param {string} segment
	 */
	constructor(name, segment) {
		this.name = name;
		this.segment = segment;
	}

	/**
	 * Fluent API method for adding questions
	 * @param {Question} question
	 * @returns {Section}
	 */
	addQuestion(question) {
		this.questions.push(question);
		return this;
	}

	/**
	 * Fluent API method for attaching conditions to the previously added question
	 * @param {boolean} shouldIncludeQuestion
	 * @returns {Section}
	 */
	withCondition(shouldIncludeQuestion) {
		if (!shouldIncludeQuestion) {
			this.questions.pop();
		}
		return this;
	}

	/**
	 * checks answers on response to ensure that a answer is provded for each required question in the section
	 * @param {JourneyResponse} journeyResponse
	 * @returns {SectionStatus}
	 */
	getStatus(journeyResponse) {
		let result = SECTION_STATUS.NOT_STARTED;
		let requiredQuestionCount = 0;
		let requiredAnswerCount = 0;
		let answerCount = 0;

		for (let question of this.questions) {
			//todo: rather than use instanceof can isRequired be a property on BaseValidator?
			const isRequired = question.validators?.some(
				(item) => item instanceof RequiredValidator || item instanceof RequiredFileUploadValidator
			);
			const answer = journeyResponse?.answers[question.fieldName];

			// increment count of required questions
			if (isRequired) {
				requiredQuestionCount++;
			}

			// move to next question if answer not provided for this question
			if (!answer) {
				continue;
			}

			answerCount++;

			// increment count of required answers in this section
			if (isRequired) {
				requiredAnswerCount++;
			}
		}

		// any answer given
		if (answerCount > 0) {
			result = SECTION_STATUS.IN_PROGRESS;
		}

		// all required questions complete
		// if no required sections this will never be hit
		if (requiredQuestionCount != 0 && requiredAnswerCount >= requiredQuestionCount) {
			result = SECTION_STATUS.COMPLETE;
		}

		return result;
	}

	//todo: taskList withCondition - i.e. evaluate whether question should be
	//included in taskList (summary list) or not. See also comment in Question class
	//constructor - should only evaluate if on task list view
}

/**
 * @typedef {string} SectionStatus
 */

/**
 * @enum {SectionStatus}
 */
const SECTION_STATUS = {
	NOT_STARTED: 'Not started',
	IN_PROGRESS: 'In progress',
	COMPLETE: 'Completed'
};

module.exports = { Section, SECTION_STATUS };
