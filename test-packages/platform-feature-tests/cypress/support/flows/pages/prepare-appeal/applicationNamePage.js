import { BasePage } from "../../../../page-objects/base-page";
module.exports = (isAppellant) => {
    
    const basePage = new BasePage();

    if (isAppellant) {
        basePage.clickRadioBtn('[data-cy="answer-yes"]');
        cy.advanceToNextPage();
    }
    else {
        basePage.clickRadioBtn('[data-cy="answer-no"]');
        cy.advanceToNextPage();
        basePage.addTextField('#appellantFirstName', 'firstname');
        basePage.addTextField('#appellantLastName', 'lastname');
        basePage.addTextField('#appellantCompanyName', 'companyname')
        cy.advanceToNextPage();

    }

};
