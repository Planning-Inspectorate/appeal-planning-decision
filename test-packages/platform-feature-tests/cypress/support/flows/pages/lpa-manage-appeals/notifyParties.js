import { BasePage } from "../../../../page-objects/base-page";
export class NotifyParties {

    _selectors = {
       
    }
    selectAndNotifyParties(context,lpaQuestionnaireData) {
        const basePage = new BasePage();
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');//Who did you notify about this application
        cy.advanceToNextPage();
        cy.checkIfUnchecked(lpaQuestionnaireData?.notifyParties?.siteNotice);
        cy.checkIfUnchecked(lpaQuestionnaireData?.notifyParties?.lettersEmailsToParties);
        cy.checkIfUnchecked(lpaQuestionnaireData?.notifyParties?.advertInLocalPress);
        cy.advanceToNextPage();
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');//Upload the site notice
        cy.advanceToNextPage();
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');//Upload letters or emails sent to interested parties with their addresses
        cy.advanceToNextPage();
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');//Upload the press advertisement
        cy.advanceToNextPage();           
    };   

}
