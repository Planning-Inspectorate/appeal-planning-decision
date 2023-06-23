/*************************************************************
 * This file holds the definition of a single questionnaire  *
 * and uses the questions defined in questions.js.           *
 *************************************************************/

const questions = require('./questions');

exports.questionnaire = {
    sections: [
        {
            name: "Constraints, designations and other issues",
            segment: "constraints",
            questions: [
                questions.questions.listedBuildingCheck,
                questions.questions.listedBuildingDetail,
                questions.questions.rightOfWayCheck,
                questions.questions.rightOfWayUpload,
                questions.questions.designatedSitesCheck
            ]
        }
    ]
}
