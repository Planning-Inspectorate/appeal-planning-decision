// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../page-objects/base-page";
import { ipCommentsTestCases } from "../../helpers/ipComments/ipCommentsData";
const { PrepareAppealSelector } = require("../../page-objects/prepare-appeal/prepare-appeal-selector");
describe('Comment on a planning appeal', () =>{
    const basePage = new BasePage();
    const prepareAppealSelector = new PrepareAppealSelector();
    beforeEach(()=>{
    cy.visit(`${Cypress.config('appeals_beta_base_url')}/comment-planning-appeal`);
    cy.get(basePage?._selectors?.govukHeaderLinkGovukHeaderServiceName).should('include.text', 'Comment on a planning appeal');
    // Validate URL
    cy.url().should('include','https://appeals-service-test.planninginspectorate.gov.uk/comment-planning-appeal/enter-appeal-reference');
   
    })
it ('should allow a user to enter a reference number and start the process',()=>{    
   // Validate reference number text field label   
   cy.get(basePage?._selectors?.govukLabelGovukLabel).should('include.text','Enter the appeal reference number');
  // Input search by reference number
    cy.get('#appeal-reference').type('6014585');
    cy.advanceToNextPage();
    cy.get('a[href*="your-name"]').click();
    cy.get('#first-name').type('Test First Name');
    cy.get('#last-name').type('Test Last Name');
    cy.advanceToNextPage();
// address is empty
    cy.advanceToNextPage();
    cy.get('#email-address').type('commenter@email.com');
    cy.advanceToNextPage();

    cy.get('#comments').type('Interested Party comments');
    cy.get('#comments-confirmation').check();
    cy.advanceToNextPage();
    cy.get(basePage?._selectors?.govukButton).should('include.text', 'Submit comments').click();
    });
it ('should allow a user to enter postcode and start the process',()=>{
   // Validate I do not have an appeal reference number
   cy.get('a[href*="enter-postcode"]').click();
   // Validate URL
   cy.url().should('include','https://appeals-service-test.planninginspectorate.gov.uk/comment-planning-appeal/enter-postcode'); 

  // Input search by post code
    cy.get('#postcode').type('SW7 9PB');
    cy.advanceToNextPage();
    });
     
it(`Validate Back button when user tries to navigate previous page from ip comments reference number  page`, () => {
    cy.advanceToNextPage();
    cy.containsMessage(prepareAppealSelector?._selectors?.govukLabelGovUkLabel1, "Enter the appeal reference number");
    basePage.backBtn();
   
 // Validate reference number text field label   
   cy.get(basePage?._selectors?.govukLabelGovukLabel).should('include.text','Enter Postcode');
});
});
