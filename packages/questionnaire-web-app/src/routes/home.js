const express = require('express');
const indexController = require('../controllers');

const questionnaire = {
    "title": "Householder appeal",
    "sections": [
        {
            "title": "Constraints, designations and other issues",
            "name": "constraints",
            "questions": [
                {
                    "question": "Would a public right of way need to be removed or diverted?",
                    "type": "boolean",
                    "fieldName": "right-of-way-check",
                    "required": true,
                    "answers": [{ "true": { "actionUrl": "/" }, "false": { "actionUrl": "/" } }],
                    "value": null
                },
                {
                    "question": "Upload the definitive map and statement extract",
                    "type": "multi-file-upload",
                    "fieldName": "right-of-way-upload",
                    "required": true,
                    "value": null
                },
                {
                    "question": "The last question?",
                    "type": "boolean",
                    "fieldName": "last-question-check",
                    "required": true,
                    "answers": [{ "true": { "actionUrl": "/" }, "false": { "actionUrl": "/" } }],
                    "value": null
                }
            ]
        }
    ]
}

const router = express.Router();

/* GET home page. */
router.get('/', indexController.getIndex);

router.get('/section/:section/question/:question', function (req, res) {
    console.log(req.params);
    return renderQuestion(req.params, res);
    // resolve view
});

router.post('section/:section/question/:question', function (req, res) {
    console.log(req);
    // resolve view
});

function renderQuestion(routeParams, res)
{
    var questionAndSection = getQuestionToRender(routeParams.section, routeParams.question);
    var questionModel = getQuestionModel(questionAndSection.question, questionnaire.title, questionAndSection.section.title);
    console.log(questionModel);
    return res.render(`questions/` + questionAndSection.question.type, questionModel);
}

function getQuestionToRender(sectionName, questionName)
{
    console.log(sectionName);
    console.log(questionName);
    var sectionObject = questionnaire.sections.find(section => section.name === sectionName);
    console.log(sectionObject);
    var questionObject = sectionObject.questions.find(question => question.fieldName === questionName);
    console.log(questionObject);
    return {section: sectionObject, question: questionObject};
}

function getQuestionModel(question, questionnaireTitle, sectionTitle)
{
    switch(question.type) {
        case 'boolean':
            return {
            questionnaireTitle: questionnaireTitle,
            question: question.question,
            fieldName: question.fieldName,
            title: questionnaireTitle,
            value: null
            }
        default:
            return {
                questionnaireTitle: questionnaireTitle,
                question: question.question,
                fieldName: question.fieldName,
                title: questionnaireTitle,
                value: null
                }
      }
}



module.exports = router;
