const nunjucks = require('nunjucks');

/**
 * @typedef {Object} ViewData
 * @property {string} layoutTemplate - path to template file
 * @property {string} pageCaption - caption displayed above question
 * @property {string} backLink - url to go back 1 page
 * @property {string} listLink - url for listing page
 * @property {Object} answers - all answers to journey so far
 * @property {Object} answer - answer to current question
 */

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
	 * @type {string} the folder name of the view
	 */
	viewFolder;
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

	/**
	 * show return to listing page link after question
	 */
	showBackToListLink = true;

	bulletPoints = [];
	details = {
		title: '',
		text: ''
	};

	/**
	 * @type {string} alternative url slug
	 */
	url;

	/**
	 * @type {string} optional html content
	 */
	html;

	constructor({ title, question, description, viewFolder, fieldName, validators, url, html } = {}) {
		if (!title || title === '') throw new Error('title parameter is mandatory');
		if (!question || question === '') throw new Error('question parameter is mandatory');
		if (!fieldName || fieldName === '') throw new Error('fieldName parameter is mandatory');
		this.title = title;
		this.question = question;
		this.description = description;
		this.viewFolder = viewFolder;
		this.fieldName = fieldName;
		this.validators = validators;
		this.url = url;
		this.html = html;
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

	/**
	 * renders this question
	 * @param {ExpressResponse} res
	 * @param {ViewData} viewModel
	 * @param {Object|undefined} customViewData
	 * @returns
	 */
	renderPage = (
		res,
		{ layoutTemplate, pageCaption, backLink, listLink, answers, answer },
		customViewData = undefined
	) => {
		const viewModel = {
			question: this.prepQuestionForRendering(answers),
			answer,

			layoutTemplate,
			pageCaption,

			navigation: ['', backLink],
			backLink,
			showBackToListLink: this.showBackToListLink,
			listLink
		};

		if (answer.uploadedFiles) {
			viewModel.uploadedFiles = answer.uploadedFiles;
			delete viewModel.answer;
		}

		return res.render(`dynamic-components/${this.viewFolder}/index`, {
			...viewModel,
			...customViewData
		});
	};
}

module.exports = Question;
