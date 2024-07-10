import { OwnsRestOfLand } from "../../../../page-objects/prepare-appeal/owns-rest-of-land";
import { IdentifyingLandowners } from "../../../../page-objects/prepare-appeal/identifying-landowners";
import { AdvertisingAppeal } from "../../../../page-objects/prepare-appeal/advertising-appeal";
import { TellingLandowners } from "../../../../page-objects/prepare-appeal/telling-landowners";

module.exports = (knowsOtherOwners) => {
    const ownsRestOfLand = new OwnsRestOfLand();
    const identifyingLandowners = new IdentifyingLandowners();
    const advertisingAppeal = new AdvertisingAppeal();
    const tellingLandowners = new TellingLandowners();   
    if(knowsOtherOwners === 'yes'){
        ownsRestOfLand.clickOwnsRestOfLand('[data-cy="answer-yes"]'); 
        cy.advanceToNextPage();
        tellingLandowners.checkTellingLandowners('[data-cy="answer-yes"]');
        cy.advanceToNextPage();
    }else {
        if(knowsOtherOwners === 'some'){
            ownsRestOfLand.clickOwnsRestOfLand('[data-cy="answer-some"]');  
            cy.advanceToNextPage();
            identifyingLandowners.checkIdentifyingLandowners('[data-cy="answer-yes"]');
            cy.advanceToNextPage();
            advertisingAppeal.checkAdvertisingAppeal('[data-cy="answer-yes"]');
            cy.advanceToNextPage();
            tellingLandowners.checkTellingLandowners('[data-cy="answer-yes"]');
            cy.advanceToNextPage();

        }else if(knowsOtherOwners === 'no') {
            ownsRestOfLand.clickOwnsRestOfLand('[data-cy="answer-no"]'); 
            cy.advanceToNextPage();
            identifyingLandowners.checkIdentifyingLandowners('[data-cy="answer-yes"]');
            cy.advanceToNextPage();
            advertisingAppeal.checkAdvertisingAppeal('[data-cy="answer-yes"]');
            cy.advanceToNextPage();
        }

    }
};