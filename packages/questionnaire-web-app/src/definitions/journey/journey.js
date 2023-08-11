/***********************************************************
 * This file holds the base class definition for a journey *
 * (e.g. questionnaire). Specific journeys should be       *
 * defined in a class which extends this one               *
 ***********************************************************/

class Journey {
    name;
    sections = [];
    response;

    constructor(response) {
        this.response = response;
    }

    getQuestionBySectionAndName(section, name) {
        return this.sections.find(s => {
            return s.segment === section;
          }).questions.find(q => {
            return q.fieldName === name;
          });
    }

    getNextQuestionUrl(appealId, section, name, answers, reverse) {
        var foundSection = false;
        var takeNextQuestion = false;
    
        var sectionsStart = reverse ? this.sections.length -1 : 0;
        for (var i=sectionsStart; (reverse ? i>=0 : i<this.sections.length); (reverse ? i--: i++)) {
            if (this.sections[i].segment === section) {
                foundSection = true;
            }
            if (foundSection) {
                var questionsStart = reverse ? this.sections[i].questions.length -1 : 0;
                for (var j=questionsStart; (reverse ? j>=0 : j<this.sections[i].questions.length); (reverse ? j--: j++)) {
                    if (takeNextQuestion) {
                        return `/questionnaire/${appealId}/${this.sections[i].segment}/${this.sections[i].questions[j].fieldName}`;
                    }
                    if (this.sections[i].questions[j].fieldName === name) {
                        takeNextQuestion = true;
                    }
                }
            }
        }
        return `/questionnaire/${appealId}`;
    }
    
    getCurrentQuestionUrl = (appealId, section, name, answers) => {
        var foundSection = false;
        var takeNextQuestion = false;
    
        var sectionsStart = 0;
        for (var i=sectionsStart; (i<this.sections.length); (i++)) {
            if (this.sections[i].segment === section) {
                foundSection = true;
            }
            if (foundSection) {
                var questionsStart = 0;
                for (var j=questionsStart; (j<this.sections[i].questions.length); (j++)) {
                    if (this.sections[i].questions[j].fieldName === name) {
                        takeNextQuestion = true;
                    }
                    if (takeNextQuestion) {
                        return `/questionnaire/${appealId}/${questionnaire.sections[i].segment}/${questionnaire.sections[i].questions[j].fieldName}`;
                    }
                }
            }
        }
        return `/questionnaire/${appealId}`;
    }
}

module.exports = { Journey };