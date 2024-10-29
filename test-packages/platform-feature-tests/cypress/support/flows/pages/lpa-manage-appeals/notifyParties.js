import { BasePage } from "../../../../page-objects/base-page";
export class NotifyParties {

    _selectors = {
       
    }
    selectAndNotifyParties(context,lpaQuestionnaireData) {
        const basePage = new BasePage();
        cy.checkIfUnchecked(lpaQuestionnaireData?.notifyParties?.siteNotice);
        cy.checkIfUnchecked(lpaQuestionnaireData?.notifyParties?.lettersEmailsToParties);
        cy.checkIfUnchecked(lpaQuestionnaireData?.notifyParties?.advertInLocalPress);
        cy.advanceToNextPage();
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
        cy.advanceToNextPage();
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
        cy.advanceToNextPage();
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
        cy.advanceToNextPage();           
    };   

}
