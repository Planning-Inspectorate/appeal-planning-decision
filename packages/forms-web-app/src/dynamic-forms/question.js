/***********************************************************
 * This file holds the class definitions for the different *
 * components (question types) including base types        *
 ***********************************************************/

const nunjucks = require('nunjucks');

// todo:
// test
// refactor
// jsdoc

class Question {
	title;
	question;
	description;
	type;
	fieldName;

	constructor({ title, question, description, type, fieldName } = {}) {
		this.title = title;
		this.question = question;
		this.description = description;
		this.type = type;
		this.fieldName = fieldName;
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

//Base type for questions with options
class OptionsQuestion extends Question {
	options;

	constructor({ title, question, description, type, fieldName, options } = {}) {
		super({ title, question, description, type, fieldName });
		this.options = options;
	}
}

module.exports = { Question, OptionsQuestion };
