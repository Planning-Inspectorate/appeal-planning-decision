const { questions } = require('./questions');
const { Journey } = require('./journey');
const { Section } = require('./section');

class HasJourney extends Journey {
    constructor(response) {
        super(response);

        this.sections.push(
            new Section("Constraints, designations and other issues","constraints")
                .addQuestion(questions.appealTypeAppropriate)
                .addQuestion(questions.listedBuildingCheck)
                .addQuestion(questions.listedBuildingDetail).withCondition(response.answers[questions.listedBuildingCheck.fieldName] == "yes")
                .addQuestion(questions.listedBuildingDetailList).withCondition(response.answers[questions.listedBuildingCheck.fieldName] == "yes")
                .addQuestion(questions.conservationArea)
                .addQuestion(questions.conservationAreaUpload).withCondition(response.answers[questions.conservationArea.fieldName] == "yes")
                .addQuestion(questions.greenBelt),
            new Section("Notifying people about the application", "notification")
                .addQuestion(questions.whoWasNotified)
                .addQuestion(questions.howYouNotifiedPeople)
                .addQuestion(questions.siteNoticeUpload).withCondition((response.answers[questions.howYouNotifiedPeople.fieldName] ?? "").includes("Site notice"))
                .addQuestion(questions.lettersToNeighboursUpload).withCondition((response.answers[questions.howYouNotifiedPeople.fieldName] ?? "").includes("Letters to neighbours"))
                .addQuestion(questions.advertisementUpload).withCondition((response.answers[questions.howYouNotifiedPeople.fieldName] ?? "").includes("Advertisement"))
        );
    }
}

module.exports = { HasJourney };