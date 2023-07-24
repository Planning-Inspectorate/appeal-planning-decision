const {body, validationResult} = require('express-validator');
const hasQuestionnaire = require('../definitions/questionnaire/hasQuestionnaire');
const questionnaire = hasQuestionnaire.questionnaire;
const formHelper = require('../lib/dynamicformhelper');

const validate = () => {
    return async (req, res, next) => {
        const {appealId, section, question} = req.params;
        var questionObj = formHelper.getQuestionBySectionAndName(questionnaire, section, question);
        const validations = [];
        switch(questionObj.validator.type) {
            case "text":
              validations.push(textValidations(questionObj))
              break;
          }

        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        // todo need to render the question with error summary
        res.status(400).json({
            errors: errors.array()
        });
    };
};

const textValidations = (questionObj) => {
    const rule = body(questionObj.fieldName);

    rule
        .isLength({ min: 100, max: questionObj.validator.maxLength })
        .withMessage("too long");
    
	return rule;
}

module.exports = {
    validate
}