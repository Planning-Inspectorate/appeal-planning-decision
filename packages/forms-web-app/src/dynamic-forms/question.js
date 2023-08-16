const nunjucks = require('nunjucks');

/**
 * A specific question within a journey which is made up of one (usually) or many (sometimes) components and their required content.
 * @class
 */
class Question {
	/**
	 * @type {string} - title used in the summary list
	 */
	title;
	/**
	 * @type {string} - question shown to user on question page
	 */
	question;
	/**
	 * @type {string} - additional information to user about the question
	 */
	description;
	/**
	 * @type {string} the type of the question (could this be removed as we can use instanceOf for the class)
	 */
	type;
	/**
	 * @type {string} the unique name of the input on the page, also used as a url segment (should this be separated)
	 */
	fieldName;

	/**
	 * @type {boolean} if the question should appear in the journey overview task list or not
	 */
	taskList;

	/**
	 * @type {string} alt text for displaying in tasklist
	 */
	altText;

	/**
	 * @type {function} function that customises the formatting of the question
	 */
	format;

	/**
	 * @type {function} function providing a custom rendering action
	 */
	renderAction;

	/**
	 * @type {function} function providing a custom saving action
	 */
	saveAction;

	/**
	 * @type {Array} array of validators that a question uses to validate answers
	 */
	validators = [];

	/**
	 * @type {string} hint text displayed to user
	 */
	hint;
	bulletPoints = [];
	details = {
		title: '',
		text: ''
	};

	constructor({ title, question, description, type, fieldName } = {}) {
		if (!title || title === '') throw new Error('title parameter is mandatory');
		if (!question || question === '') throw new Error('question parameter is mandatory');
		if (!fieldName || fieldName === '') throw new Error('fieldName parameter is mandatory');
		this.title = title;
		this.question = question;
		this.description = description;
		this.type = type;
		this.fieldName = fieldName;
		//todo: taskList default to true, or pass in as param if question shouldn't be displayed in task (summary) list
		//or possibly add taskList condition to the Section class as part of withCondition method(or similar) if possible?
	}

	prepQuestionForRendering(answers) {
		var answer = answers[this.fieldName];
		var processedQuestion = { ...this };
		processedQuestion.value = answer;
		if (this.options !== undefined && this.options.length > 0) {
			processedQuestion.options = [];
			for (var i = 0; i < this.options.length; i++) {
				var option = { ...this.options[i] };
				if (option.value !== undefined) {
					option.checked = (',' + answer + ',').includes(',' + option.value + ',');
				}
				//also need to handle dependent fields & set their answers
				if (option.conditional !== undefined) {
					var conditionalField = { ...option.conditional };
					conditionalField.fieldName =
						processedQuestion.fieldName + '_' + conditionalField.fieldName;
					conditionalField.value = answers[conditionalField.fieldName] || '';
					option.conditional = {
						html: nunjucks.render(
							`../views/questions/conditional/${conditionalField.type}.njk`,
							conditionalField
						)
					};
				}
				processedQuestion.options.push(option);
			}
		}
		return processedQuestion;
	}
}

module.exports = Question;
