import { BasePage } from "../../../../page-objects/base-page";
module.exports = (context) => {
    const basePage = new BasePage();

    if (context?.applicationForm?.isAppellantSiteSafety) {
        basePage.clickRadioBtn('[data-cy="answer-yes"]');     
        basePage.addTextField('#appellantSiteSafety_appellantSiteSafetyDetails','appellantSiteSafety_appellantSiteSafetyDetails1234567890!"£$%^&*(10)');       
        cy.advanceToNextPage();
    }
    else {
        basePage.clickRadioBtn('[data-cy="answer-no"]');
        cy.advanceToNextPage();
    }
};