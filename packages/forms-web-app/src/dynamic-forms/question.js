/***********************************************************
 * This file holds the class definitions for the different *
 * components (question types) including base types        *
 ***********************************************************/

const nunjucks = require('nunjucks');

class Question {
	title;
	question;
	description;
	type;
	fieldName;
	validators = [];
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
