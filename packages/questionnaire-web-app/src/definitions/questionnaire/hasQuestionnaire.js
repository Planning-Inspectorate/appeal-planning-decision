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
                questions.questions.appealTypeAppropriate,
                questions.questions.listedBuildingCheck,
                questions.questions.listedBuildingDetail,
                questions.questions.listedBuildingDetailList,
                questions.questions.conservationArea,
                questions.questions.conservationAreaUpload,
                questions.questions.greenBelt
            ]
        },
        {
            name: "Notifying people about the application",
            segment: "notification",
            questions: [
                questions.questions.whoWasNotified,
                questions.questions.howYouNotifiedPeople,
                questions.questions.siteNoticeUpload,
                questions.questions.lettersToNeighboursUpload,
                questions.questions.advertisementUpload
            ]
        },
        {
            name: "Consultation responses and representations",
            segment: "representations",
            questions: [
                questions.questions.representationsFromOthers,
                questions.questions.representationUpload
            ]
        },
        {
            name: "Planning officer’s report and supplementary documents",
            segment: "planning",
            questions: [
                questions.questions.planningOfficersUpload
            ]
        },
        {
            name: "Site access",
            segment: "health-and-safety",
            questions: [
                questions.questions.accessForInspection,
                questions.questions.potentialSafetyRisks
            ]
        }
    ]
}
