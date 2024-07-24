import { BasePage } from "../../../../page-objects/base-page";
export class OwnsLandInvolvedPage{
    
    _selectors={
        ownsLandInvolvedYes: '[data-cy="answer-yes"]',
        ownsLandInvolvedSome: '[data-cy="answer-some"]',
        ownsLandInvolvedNo: '[data-cy="answer-no"]'
    }

    addOwnsLandInvolvedData(knowsAllOwners){
        const basePage = new BasePage();
    
        //ownsLandInvolved.clickOwnsLandInvolved('#knowsAllOwners-2'); ('[data-cy="answer-no"]'); 
        if(knowsAllOwners === 'yes'){
            //ownsLandInvolved.clickOwnsLandInvolved('[data-cy="answer-yes"]');
            basePage.clickRadioBtn(this._selectors?.ownsLandInvolvedYes);
            cy.advanceToNextPage();
            //tellingLandowners.checkTellingLandowners('[data-cy="answer-yes"]');
            basePage.clickRadioBtn('[data-cy="answer-yes"]');
            cy.advanceToNextPage();
        }else {
            if(knowsAllOwners === 'some'){
                //ownsLandInvolved.clickOwnsLandInvolved('[data-cy="answer-some"]'); 
                basePage.clickRadioBtn(this._selectors?.ownsLandInvolvedSome); 
                cy.advanceToNextPage();
                //identifyingLandowners.checkIdentifyingLandowners('[data-cy="answer-yes"]');
                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();
                //advertisingAppeal.checkAdvertisingAppeal('[data-cy="answer-yes"]');
                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();
                //tellingLandowners.checkTellingLandowners('[data-cy="answer-yes"]');
                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();

            }else if(knowsAllOwners === 'no') {
                //ownsLandInvolved.clickOwnsLandInvolved('[data-cy="answer-no"]'); 
                basePage.clickRadioBtn(this._selectors?.ownsLandInvolvedNo);
                cy.advanceToNextPage();
                //identifyingLandowners.checkIdentifyingLandowners('[data-cy="answer-yes"]');
                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();
                //advertisingAppeal.checkAdvertisingAppeal('[data-cy="answer-yes"]');
                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();
            }

        } 
    };
   
}