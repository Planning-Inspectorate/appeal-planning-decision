import { BasePage } from "../../../../page-objects/base-page";
export class PoReportAndSupportDocs {

    _selectors = {
       
    }
    selectPOReportAndSupportDocs(context) {
        const basePage = new BasePage();
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
        cy.advanceToNextPage();
        cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
        cy.advanceToNextPage();         
    };  
}
