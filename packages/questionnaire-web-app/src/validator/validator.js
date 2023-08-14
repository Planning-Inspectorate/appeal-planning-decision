const { body, validationResult } = require('express-validator');
const hasQuestionnaire = require('../definitions/questionnaire/hasQuestionnaire');
const questionnaire = hasQuestionnaire.questionnaire;
const formHelper = require('../lib/dynamicformhelper');
const { BooleanValidator } = require('./booleanValidator');

const validate = () => {
    return async (req, res, next) => {
        const { appealId, section, question } = req.params;
        var questionObj = formHelper.getQuestionBySectionAndName(questionnaire, section, question);
        const validations = [];
        switch (questionObj.validator?.type) {
            case "text":
                validations.push(textValidations(questionObj))
                break;
            case "boolean":
                validations.push(booleanValidations(questionObj))
                break;
            case "boolean-text":
                validations.push(booleanValidations(questionObj))
                validations.push(textValidations(questionObj))
                break;
        }
        foreach(validation in validations)
        {
            const errors = validationResult(req);
            const mappedErrors = errors.mapped();
            if(mappedErrors.length > 0)
            {
                next();
            }
        }
        await Promise.all(validations.map(validation => validation.run(req)));

       next();
    };
};

const booleanValidations = (questionObj) => {
    const rule = body(questionObj.fieldName);
    rule
        .exists()
        .withMessage(questionObj.validator.selectionRequiredErrorMessage ?? "Please select a value");

    return rule;
}

const textValidations = (questionObj) => {
    const rule = body(questionObj[questionObj.validator?.textField] ?? questionObj.fieldName);
    rule
        .notEmpty().optional(questionObj.validator?.empty ?? false)
        .withMessage(questionObj.validator?.errorMessage ?? "No value provided")
        .bail()
        .isLength({ min: 5, max: questionObj.validator.maxLength ?? 99999999 })
        .withMessage("Incorrect length");

    return rule;
}


module.exports = {
    validate
}

min: int and max:int
empty: bool