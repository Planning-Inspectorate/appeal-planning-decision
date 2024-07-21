import { BasePage } from "../../../../page-objects/base-page";

module.exports = (knowsOtherOwners) => {
    const basePage = new BasePage();
   
    if(knowsOtherOwners === 'yes'){
        //ownsRestOfLand.clickOwnsRestOfLand('[data-cy="answer-yes"]'); 
        basePage.clickRadioBtn('[data-cy="answer-yes"]'); 
        cy.advanceToNextPage();
        //tellingLandowners.checkTellingLandowners('[data-cy="answer-yes"]');
        basePage.clickRadioBtn('[data-cy="answer-yes"]'); 
        cy.advanceToNextPage();
    }else {
        if(knowsOtherOwners === 'some'){
           // ownsRestOfLand.clickOwnsRestOfLand('[data-cy="answer-some"]'); 
           basePage.clickRadioBtn('[data-cy="answer-some"]');  
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
            basePage.clickRadioBtn('[data-cy="answer-no"]');
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