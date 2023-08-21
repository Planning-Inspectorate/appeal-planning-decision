const { body } = require('express-validator');
const hasQuestionnaire = require('../definitions/questionnaire/hasQuestionnaire');
const questionnaire = hasQuestionnaire.questionnaire;
const formHelper = require('../lib/dynamicformhelper');

class BooleanValidator {
	validate(questionObj, errorMessage) {
		return body(questionObj.fieldName).notEmpty().withMessage(errorMessage);
	}
}

const validate = () => {
	return async (req, res, next) => {
		const { section, question } = req.params;
		var questionObj = formHelper.getQuestionBySectionAndName(questionnaire, section, question);
		const validations = [];
		switch (questionObj.validator.constructor) {
			case BooleanValidator:
				validations.push(new BooleanValidator().validate(questionObj));
				break;
		}
		await Promise.all(validations.map((validation) => validation.run(req)));

		next();
	};
};

module.exports = validate;
