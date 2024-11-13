import { BasePage } from "../../../../page-objects/base-page";
export class ConsultResponseAndRepresent {

    _selectors = {
       
    }

    selectOtherPartyRepresentations(context) {
        const basePage = new BasePage();

        if(context?.consultResponseAndRepresent?.isOtherPartyRepresentations){
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();		
            cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
            cy.advanceToNextPage();	
    
        } else {		
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
	
        }
    };

}
