// @ts-nocheck
/// <reference types="cypress"/>
export class NotifyParties {

    _selectors = {

    }
    selectAndNotifyParties(context, lpaManageAppealsData) {        
        //Who did you notify about this application
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
        cy.advanceToNextPage();
        cy.checkIfUnchecked(lpaManageAppealsData?.notifyParties?.siteNotice);
        cy.checkIfUnchecked(lpaManageAppealsData?.notifyParties?.lettersEmailsToParties);
        cy.checkIfUnchecked(lpaManageAppealsData?.notifyParties?.advertInLocalPress);
        cy.advanceToNextPage();
        //Upload the site notice
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
        cy.advanceToNextPage();
        //Upload letters or emails sent to interested parties with their addresses
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
        cy.advanceToNextPage();
        //Upload the press advertisement
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
        cy.advanceToNextPage();
    };
}
