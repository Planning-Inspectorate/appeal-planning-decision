/*************************************************************
 * Utility functions for working with dynamic form           *
 * definitions                                               *
 *************************************************************/


const nunjucks = require("nunjucks");

exports.getQuestionBySectionAndName = (questionnaire, section, name) => {
    return questionnaire.sections.find(s => {
        return s.segment === section;
      }).questions.find(q => {
        return q.fieldName === name;
      });
}

exports.getNextQuestionUrl = (questionnaire, appealId, section, name, answers, reverse) => {
    var foundSection = false;
    var takeNextQuestion = false;

    var sectionsStart = reverse ? questionnaire.sections.length -1 : 0;
    for (var i=sectionsStart; (reverse ? i>=0 : i<questionnaire.sections.length); (reverse ? i--: i++)) {
        if (questionnaire.sections[i].segment === section) {
            foundSection = true;
        }
        if (foundSection) {
            var questionsStart = reverse ? questionnaire.sections[i].questions.length -1 : 0;
            for (var j=questionsStart; (reverse ? j>=0 : j<questionnaire.sections[i].questions.length); (reverse ? j--: j++)) {
                if (takeNextQuestion && questionnaire.sections[i].questions[j].show(answers)) {
                    return `/questionnaire/${appealId}/${questionnaire.sections[i].segment}/${questionnaire.sections[i].questions[j].fieldName}`;
                }
                if (questionnaire.sections[i].questions[j].fieldName === name) {
                    takeNextQuestion = true;
                }
            }
        }
    }
    return `/questionnaire/${appealId}`;
}

exports.getCurrentQuestionUrl = (questionnaire, appealId, section, name, answers) => {
    var foundSection = false;
    var takeNextQuestion = false;

    var sectionsStart = 0;
    for (var i=sectionsStart; (i<questionnaire.sections.length); (i++)) {
        if (questionnaire.sections[i].segment === section) {
            foundSection = true;
        }
        if (foundSection) {
            var questionsStart = 0;
            for (var j=questionsStart; (j<questionnaire.sections[i].questions.length); (j++)) {
                if (questionnaire.sections[i].questions[j].fieldName === name) {
                    takeNextQuestion = true;
                }
                if (takeNextQuestion && questionnaire.sections[i].questions[j].show(answers)) {
                    return `/questionnaire/${appealId}/${questionnaire.sections[i].segment}/${questionnaire.sections[i].questions[j].fieldName}`;
                }
            }
        }
    }
    return `/questionnaire/${appealId}`;
}

exports.prepQuestionForRendering = (question, answers) => {
    var answer = answers[question.fieldName];
    var processedQuestion = {...question};
    processedQuestion.value = answer;
    if (question.options !== undefined && question.options.length > 0) {
        processedQuestion.options = [];
        for (var i = 0; i<question.options.length; i++) {
            var option = {...question.options[i]};
            if (option.value !== undefined) {
                option.checked = ((',' + answer + ',').includes(',' + option.value + ','));
            }
            //also need to handle dependent fields & set their answers
            if (option.conditional !== undefined) {
                var conditionalField = {...option.conditional};
                conditionalField.fieldName = processedQuestion.fieldName + '_' + conditionalField.fieldName;
                conditionalField.value = answers[conditionalField.fieldName] || "";
                console.log(answers[conditionalField.fieldName]);
                option.conditional = { html: nunjucks.render(`../views/questions/conditional/${conditionalField.type}.njk`, conditionalField) };
            }
            processedQuestion.options.push(option);
        }
    }
    return processedQuestion;
}