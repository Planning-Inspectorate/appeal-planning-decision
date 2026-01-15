/**
 * @typedef {import('./question')} Question
 * @typedef {import('./journey-response').JourneyResponse} JourneyResponse
 * @typedef {((response: JourneyResponse) => boolean)} QuestionCondition
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
	 * @type {Array<Question>} - questions within the section
	 */
	questions = [];

	/**
	 * @type {boolean} - if a condition has just been added ensure a question is added before the next condition
	 */
	#conditionAdded = false;

	/**
	 * conditions to apply to a set of questions, until ended is true
	 * @type {Object<string, {ended: boolean, condition: QuestionCondition}>}
	 */
	#multiQuestionConditions = {};

	/**
	 * @type {any}} - variables within the section
	 */
	sectionVariables;

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
	 * @param {any} question
	 * @returns {Section}
	 */
	addQuestion(question) {
		this.questions.push(question);
		this.#conditionAdded = false; // reset condition flag
		this.#applyConditions(question);
		return this;
	}

	/**
	 * Fluent API method for adding multiple questions and conditions
	 * @param {Array<{question: any, condition?: QuestionCondition}>} questionsArray
	 * @returns {Section}
	 */
	addQuestions(questionsArray) {
		questionsArray.forEach((question) => {
			this.addQuestion(question.question);
			if (question.condition) this.withCondition(question.condition);
		});
		return this;
	}

	/**
	 * @param {any} questionVariable
	 * @returns {this}
	 */
	withVariables(questionVariable) {
		this.sectionVariables = {
			...this.sectionVariables,
			...questionVariable
		};
		return this;
	}

	/**
	 * Apply conditions to the given question
	 * @param {any} question
	 * @param [condition] - specific condition for this question
	 */
	#applyConditions(question, condition) {
		const conditions = [];

		// any group conditions that are active
		const groupConditions = Object.values(this.#multiQuestionConditions)
			.filter((group) => !group.ended)
			.map((group) => group.condition);
		conditions.push(...groupConditions);

		// add the specific condition for this question
		if (condition) {
			conditions.push(condition);
		}

		// combine all conditions into a single function
		question.shouldDisplay = (response) => conditions.every((condition) => condition(response));
	}

	/**
	 * Fluent API method for attaching conditions to the previously added question
	 * @param {QuestionCondition} shouldIncludeQuestion
	 * @returns {Section}
	 */
	withCondition(shouldIncludeQuestion) {
		if (this.#conditionAdded) {
			// don't allow two conditions in a row
			throw new Error('conditions must follow a question');
		}
		this.#conditionAdded = true; // set condition flag
		const lastQuestionAdded = this.questions.length - 1;
		const question = this.questions[lastQuestionAdded];

		this.#applyConditions(question, shouldIncludeQuestion);
		return this;
	}

	/**
	 * Fluent API method for starting a multi question condition
	 * @param {string} conditionName
	 * @param {QuestionCondition} shouldIncludeQuestion
	 * @returns {Section}
	 */
	startMultiQuestionCondition(conditionName, shouldIncludeQuestion) {
		if (this.#multiQuestionConditions[conditionName]) {
			throw new Error('group condition already started');
		}
		this.#multiQuestionConditions[conditionName] = {
			ended: false,
			condition: shouldIncludeQuestion
		};
		return this;
	}

	/**
	 * Fluent API method for ending a multi question condition
	 * @param {string} conditionName
	 * @returns {Section}
	 */
	endMultiQuestionCondition(conditionName) {
		if (!this.#multiQuestionConditions[conditionName]) {
			throw new Error('group condition not started');
		}
		this.#multiQuestionConditions[conditionName].ended = true;
		return this;
	}

	/**
	 * checks answers on response to ensure that a answer is provided for each required question in the section
	 * @param {JourneyResponse} journeyResponse
	 * @returns {SectionStatus}
	 */
	getStatus(journeyResponse) {
		let result = SECTION_STATUS.NOT_STARTED;
		let requiredQuestionCount = 0;
		let requiredAnswerCount = 0;
		let answerCount = 0;

		for (let question of this.questions) {
			if (!question.shouldDisplay(journeyResponse)) {
				continue;
			}

			if (question.isRequired()) {
				requiredQuestionCount++;
			}

			if (question.isAnswered(journeyResponse)) {
				answerCount++;
			}

			if (question.isAnswered(journeyResponse) && question.isRequired()) {
				requiredAnswerCount++;
			}
		}

		// any answer given
		if (answerCount > 0) {
			result = SECTION_STATUS.IN_PROGRESS;
		}

		// all required questions complete
		// if no required sections this will never be hit
		if (requiredQuestionCount !== 0 && requiredAnswerCount >= requiredQuestionCount) {
			result = SECTION_STATUS.COMPLETE;
		}

		return result;
	}

	/**
	 * checks answers on response and return true if the status of the section is complete
	 * @param {JourneyResponse} journeyResponse
	 * @returns {boolean}
	 */
	isComplete(journeyResponse) {
		return this.getStatus(journeyResponse) === SECTION_STATUS.COMPLETE;
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
