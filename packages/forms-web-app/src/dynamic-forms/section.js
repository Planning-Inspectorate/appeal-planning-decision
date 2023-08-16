/**
 * @typedef {import('./question').Question} Question
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

	//todo: taskList withCondition - i.e. evaluate whether question should be
	//included in taskList (summary list) or not. See also comment in Question class
	//constructor - should only evaluate if on task list view
}

module.exports = { Section };
