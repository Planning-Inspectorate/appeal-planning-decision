const express = require('express');
const indexController = require('../controllers');

const appeal = {}
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
                    "answers": [{ "true": { "action": "right-of-way-upload" }, "false": { "action": "last-question-check" } }],
                    "value": null
                },
                {
                    "question": "Upload the definitive map and statement extract",
                    "type": "single-file-upload",
                    "fieldName": "right-of-way-upload",
                    "value": null,
                    "filePropName": "rightOfWay",
                    "answers": [{"next": {"action": "right-of-way-check"}}]
                },
                {
                    "question": "The last question?",
                    "type": "boolean",
                    "fieldName": "last-question-check",
                    "required": true,
                    "answers": [{ "true": { "action": "home" }, "false": { "action": "home" } }],
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
    return renderQuestion(req.params, res);
    // resolve view
});

router.post('/section/:section/question/:question', function (req, res) {
    console.log(req.body)
    debugger;
    var nextQuestion = processSubmission(req, res);
    return res.redirect('/section/' + req.params.section + '/question/' + nextQuestion);
    // resolve view
});

function renderQuestion(routeParams, res)
{
    var questionAndSection = getQuestionToRender(routeParams.section, routeParams.question);
    var questionModel = getQuestionModel(questionAndSection.question, questionnaire.title, questionAndSection.section.name);
    console.log(questionModel);
    return res.render(`questions/` + questionAndSection.question.type, questionModel);
}

function getQuestionToRender(sectionName, questionName)
{
    var sectionObject = questionnaire.sections.find(section => section.name === sectionName);
    var questionObject = sectionObject.questions.find(question => question.fieldName === questionName);
    return {section: sectionObject, question: questionObject};
}

function getQuestionModel(question, questionnaireTitle, sectionName, appeal)
{
    switch(question.type) {
        case 'boolean':
            return {
            questionnaireTitle: questionnaireTitle,
            question: question.question,
            fieldName: question.fieldName,
            title: questionnaireTitle,
            sectionName: sectionName,
            value: appeal?.constraints?.rightOfWayCheck
            }
        case 'single-file-upload':
            return{
            questionnaireTitle: questionnaireTitle,
            question: question.question,
            fieldName: question.fieldName,
            title: questionnaireTitle,
            sectionName: sectionName,
            value: appeal?.requiredDocumentsSection?.[question.filePropName]?.uploadedFile
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

function processSubmission(req, res)
{
    var sectionObject = questionnaire.sections.find(section => section.name === req.params.section);
    var questionObject = sectionObject.questions.find(question => question.fieldName === req.params.question);
    var res = processQuestionSubmission(questionObject, req);
    return res;

}

function processQuestionSubmission(question, req, res)
{
    var response = null;
    console.log(req['file-upload']);
    switch(question.type) {
        case 'boolean':
            response = question.answers[0][req.body[question.fieldName]].action;
            return response;
        case 'single-file-upload':
            var result = processFiles(req);
            response = question.answers[0]['next'].action;
            return response;
        default:
            return false;
      }
}

function processFiles(req)
{
    console.log(req.files);
    console.log('Processed files');
    return true;
}


module.exports = router;
