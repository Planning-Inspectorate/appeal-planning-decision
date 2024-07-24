import { BasePage } from "../../../../page-objects/base-page";
export class OwnsRestOfLandPage{

    _selectors={
        ownsRestOfLandYes: '[data-cy="answer-yes"]',
        ownsRestOfLandSome: '[data-cy="answer-some"]',
        ownsRestOfLandNo: '[data-cy="answer-no"]'
    }
    
    addOwnsRestOfLandgData(knowsOtherOwners){
        const basePage = new BasePage();
   
        if(knowsOtherOwners === 'yes'){
            //ownsRestOfLand.clickOwnsRestOfLand('[data-cy="answer-yes"]'); 
            basePage.clickRadioBtn(this._selectors?.ownsRestOfLandYes); 
            cy.advanceToNextPage();
            //tellingLandowners.checkTellingLandowners('[data-cy="answer-yes"]');
            basePage.clickRadioBtn('[data-cy="answer-yes"]'); 
            cy.advanceToNextPage();
        }else {
            if(knowsOtherOwners === 'some'){
            // ownsRestOfLand.clickOwnsRestOfLand('[data-cy="answer-some"]'); 
            basePage.clickRadioBtn(this._selectors?.ownsRestOfLandSome);  
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

            }else if(knowsOtherOwners === 'no') {
                //ownsRestOfLand.clickOwnsRestOfLand('[data-cy="answer-no"]');
                basePage.clickRadioBtn(this._selectors?.ownsRestOfLandNo);
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