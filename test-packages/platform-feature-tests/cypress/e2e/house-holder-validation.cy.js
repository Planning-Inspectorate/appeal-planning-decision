import { BasePage } from "../page-objects/base-page";
const { PrepareAppealSelector } = require("../page-objects/prepare-appeal/prepare-appeal-selector");
const applicationFormPage = require("../support/flows/pages/prepare-appeal/applicationFormPage");
const { ApplicationNamePage } = require("../support/flows/pages/prepare-appeal/applicationNamePage");


describe('House Holder Date Validations', () => {
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
       
    })

    it(`Validate future date error message  in decision date page for future year`, () => {
        let currentDate = new Date();
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(currentDate.getDate());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(currentDate.getMonth() + 1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentDate.getFullYear() + 1 );
        cy.advanceToNextPage();
        
        cy.get(".govuk-error-summary__body > ul > li > a ").should('have.text', 'Decision date must be today or in the past');
    });

    it(`Validate future date error message  in decision date page future month`, () => {
        let currentDate = new Date();
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(currentDate.getDate());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(currentDate.getMonth() + 2);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentDate.getFullYear());
        cy.advanceToNextPage();
        
        cy.get(".govuk-error-summary__body > ul > li > a ").should('have.text', 'Decision date must be today or in the past');
    });

    it(`Validate future date error message  in decision date page future day`, () => {
        let currentDate = new Date();
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(currentDate.getDate() + 1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(currentDate.getMonth() + 1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentDate.getFullYear());
        cy.advanceToNextPage();
        
        cy.get(".govuk-error-summary__body > ul > li > a ").should('have.text', 'The Decision Date must be a real date');
    });

    it(`Validate future date error message  in decision date page negative date`, () => {
        let currentDate = new Date();
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type( -1 );
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(currentDate.getMonth() + 1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentDate.getFullYear());
        cy.advanceToNextPage();
        
        cy.get(".govuk-error-summary__body > ul > li > a ").should('have.text', 'The Decision Date must be a real date');
    });

    it(`Validate future date error message  in decision date page past year`, () => {
        let currentDate = new Date();
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(currentDate.getDate() );
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(currentDate.getMonth() + 1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentDate.getFullYear() - 1);
        cy.advanceToNextPage();
        
        cy.get(".govuk-heading-l").should('have.text', 'You cannot appeal.');
        cy.get(".govuk-body").should('have.text', 'Your deadline to appeal has passed.');
    });
      
});

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
        cy.get('.govuk-heading-l').should('have.text','Your email address is confirmed')
    }); 
    
    it(`Validate error message when incorrect email code received `, () => {
        cy.get('[data-cy="answer-no"]').click();
        cy.advanceToNextPage();
        cy.advanceToNextPage('Continue to my appeal');
        const applicationNumber = `TEST-${Date.now()}`;
	    cy.get('[data-cy="application-number"]').type(applicationNumber);
	    cy.advanceToNextPage();
        cy.get('[data-cy="email-address"]').type('appellant2@planninginspectorate.gov.uk');
	    cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type('@12345');	
	    cy.advanceToNextPage(); 
        cy.get('.govuk-error-summary__body > ul > li > a').should('have.text','Enter the correct code')
    }); 

     it(`Validate correct email code received `, () => {
        const applicationNamePage = new ApplicationNamePage();
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
        cy.advanceToNextPage(); 
        cy.advanceToNextPage();

        cy.location('search').then((search) => {
            const params = new URLSearchParams(search);
            const dynamicId = params.get('id');
            applicationFormPage('householder', 'other', dynamicId);

            applicationNamePage.addApplicationNameData(false);
            cy.get('.govuk-link').click();
            cy.get(`a[href*="/appeals/householder/prepare-appeal/application-name?id=${dynamicId}"]`).contains('Change')
        });      
    }); 
});
