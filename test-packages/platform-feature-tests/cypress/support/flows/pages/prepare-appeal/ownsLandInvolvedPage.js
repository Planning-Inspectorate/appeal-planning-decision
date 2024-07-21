import { BasePage } from "../../../../page-objects/base-page";

module.exports = (knowsAllOwners) => {
    const basePage = new BasePage();
    
    //ownsLandInvolved.clickOwnsLandInvolved('#knowsAllOwners-2'); ('[data-cy="answer-no"]'); 
    if(knowsAllOwners === 'yes'){
        //ownsLandInvolved.clickOwnsLandInvolved('[data-cy="answer-yes"]');
        basePage.clickRadioBtn('[data-cy="answer-yes"]');
        cy.advanceToNextPage();
        //tellingLandowners.checkTellingLandowners('[data-cy="answer-yes"]');
        basePage.clickRadioBtn('[data-cy="answer-yes"]');
        cy.advanceToNextPage();
    }else {
        if(knowsAllOwners === 'some'){
            //ownsLandInvolved.clickOwnsLandInvolved('[data-cy="answer-some"]'); 
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

        }else if(knowsAllOwners === 'no') {
            //ownsLandInvolved.clickOwnsLandInvolved('[data-cy="answer-no"]'); 
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