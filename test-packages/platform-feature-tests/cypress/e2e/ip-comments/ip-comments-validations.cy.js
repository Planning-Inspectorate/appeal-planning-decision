// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../page-objects/base-page";
const { PrepareAppealSelector } = require("../../page-objects/prepare-appeal/prepare-appeal-selector");
describe('Comment on a planning appeal validations', () =>{
    const basePage = new BasePage();
    const prepareAppealSelector = new PrepareAppealSelector();
    beforeEach(()=>{
    cy.visit(`${Cypress.config('appeals_beta_base_url')}/comment-planning-appeal`);     
    })
it ('should validate service name and URL for IP Comments',()=>{ 
    cy.get(basePage?._selectors?.govukHeaderLinkGovukHeaderServiceName).should('include.text', 'Comment on a planning appeal');   
    cy.url().should('include','https://appeals-service-test.planninginspectorate.gov.uk/comment-planning-appeal/enter-appeal-reference');   
       
     });
it ('should Validate incorrect reference number Error message',()=>{      
    cy.get(basePage?._selectors?.govukLabelGovukLabel).should('include.text','Appeal reference number must be 7 digits');
    cy.get('#appeal-reference').type('123456');
    cy.advanceToNextPage();
    cy.get('#appeal-reference').type('AB12456');
    cy.advanceToNextPage();
    });
it ('should Validate URL for enter a postcode',()=>{
    cy.url().should('include','https://appeals-service-test.planninginspectorate.gov.uk/comment-planning-appeal/enter-postcode'); 
    });
it ('should Validate Incorrect postcode error message',()=>{
    cy.get(basePage?._selectors?.govukLabelGovukLabel).should('include.text','Appeal reference number must be 7 digits');
    cy.get('#postcode').type('SW7 9p');
    cy.advanceToNextPage();
        });
     
it(`Validate Back button when user tries to navigate previous page from ip comments reference number  page`, () => {
    cy.advanceToNextPage();
    cy.containsMessage(prepareAppealSelector?._selectors?.govukLabelGovUkLabel1, "Enter the appeal reference number");
    basePage.backBtn();
   
 // Validate re text field label   
   cy.get(basePage?._selectors?.govukLabelGovukLabel).should('include.text','Enter Postcode');
});
});
