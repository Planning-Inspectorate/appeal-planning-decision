import { BasePage } from "../page-objects/base-page";
const { PrepareAppealSelector } = require("../page-objects/prepare-appeal/prepare-appeal-selector");

describe('House Holder Validations', () => {
    const prepareAppealSelector = new PrepareAppealSelector();
    const basePage = new BasePage();

    beforeEach(() => {
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
        cy.advanceToNextPage();
        cy.get('#local-planning-department')
            .type('System Test Borough Council')
            .get('#local-planning-department__option--0')
            .click();
        cy.advanceToNextPage();

        cy.get(`[data-cy="answer-householder-planning"]`).click();
	    cy.advanceToNextPage();

        cy.get('[data-cy="answer-listed-building"]').click();
	    cy.advanceToNextPage();

        cy.get('[data-cy="answer-refused"]').click();
	    cy.advanceToNextPage();

        let currentDate = new Date();
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(currentDate.getDate());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(currentDate.getMonth() + 1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentDate.getFullYear());
        cy.advanceToNextPage();
    })

    // House Holding
    //typeOfPlanningApplication?.forEach((planning) => {
    it(`Validate error message when user tries to navigate next page without selecting mandatory fields for enforecement`, () => {
        cy.advanceToNextPage();
        cy.get(".govuk-error-summary__body > ul > li > a ").should('have.text', 'Select yes if you have received an enforcement notice');
    });
    it(`Validate Back button when user tries to navigate previous page from enforcement page`, () => {
        cy.advanceToNextPage();
        cy.get(".govuk-error-summary__body > ul > li > a ").should('have.text', 'Select yes if you have received an enforcement notice');
        basePage.backBtn();
        cy.get(".govuk-fieldset__heading").contains("What’s the date on the decision letter from the local planning authority?");
    });
    it(`Validate exiting service page and button when user tries to use exiting appeals case work portal`, () => {
        cy.get('[data-cy="answer-yes"]').click();
        cy.advanceToNextPage();
        cy.get(".govuk-heading-l").should('have.text', 'You need to use the existing service');
        cy.get(".govuk-button").contains('Continue to the Appeals Casework Portal');
    });

    it(`Validate emails address with correct email format`, () => {
        cy.get('[data-cy="answer-no"]').click();
        cy.advanceToNextPage();
        cy.advanceToNextPage('Continue to my appeal');
        const applicationNumber = `TEST-${Date.now()}`;
	    cy.get('[data-cy="application-number"]').type(applicationNumber);
	    cy.advanceToNextPage();
        cy.get('[data-cy="email-address"]').type('abcdtestemail');
	    cy.advanceToNextPage();
        cy.get(".govuk-error-summary__body > ul > li > a ").should('have.text', 'Enter an email address in the correct format, like name@example.com');
    });

    it(`Validate correct email code received `, () => {
        cy.get('[data-cy="answer-no"]').click();
        cy.advanceToNextPage();
        cy.advanceToNextPage('Continue to my appeal');
        const applicationNumber = `TEST-${Date.now()}`;
	    cy.get('[data-cy="application-number"]').type(applicationNumber);
	    cy.advanceToNextPage();
        cy.get('[data-cy="email-address"]').type('appellant2@planninginspectorate.gov.uk');
	    cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type('12345');	
	    cy.advanceToNextPage();    
    });    
});
