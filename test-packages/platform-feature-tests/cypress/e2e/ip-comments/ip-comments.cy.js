// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../page-objects/base-page";
import { ipCommentsTestCases } from "../../helpers/ipComments/ipCommentsData";
const { PrepareAppealSelector } = require("../../page-objects/prepare-appeal/prepare-appeal-selector");
describe('Comment on a planning appeal', () => {
  const basePage = new BasePage();
  const prepareAppealSelector = new PrepareAppealSelector();
  let prepareAppealData;
  let appealId;
  beforeEach(() => {
    cy.fixture('prepareAppealData').then(data => {
      prepareAppealData = data;
    })
    cy.visit(`${Cypress.config('appeals_beta_base_url')}/comment-planning-appeal`);
    cy.get(basePage?._selectors?.govukHeaderLinkGovukHeaderServiceName).should('include.text', 'Comment on a planning appeal');

  })

  it('should allow a user to enter postcode and start the process', () => {
    // Validate I do not have an appeal reference number
    cy.get('a[href*="enter-postcode"]').click();
    // Validate URL
    cy.url().should('include', 'https://appeals-service-test.planninginspectorate.gov.uk/comment-planning-appeal/enter-postcode');

    // Input search by post code
    cy.get('#postcode').type('SW7 9PB');
    cy.advanceToNextPage();
    let counter = 0;
    cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
      const rowtext = $row.text();
      if (rowtext.includes(prepareAppealData?.commentOpen)) {
        if (counter === 0) {
          cy.wrap($row).within(() => {
            cy.get('a').each(($link) => {
              appealId = $link.attr('href')?.split('/').pop();
              cy.log(appealId);
              cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
              return false;
            });
          });
        }
        counter++;
      }
    });

    cy.get(basePage?._selectors?.govukButton).contains(prepareAppealData?.commentOnThisAppealButton).click();
    //What is your name?
    cy.get('#first-name').type('Test First Name WPCS');
    cy.get('#last-name').type('Test Last Name');
    cy.advanceToNextPage();
    // address is empty
    cy.get('a[href="email-address"]').click();
    //  Email Address empty    
    cy.get('a[href="add-comments"]').click();
    cy.get('#comments').type('Interested Party comments with post code search');
    cy.get('#comments-confirmation').check();
    cy.advanceToNextPage();
    cy.get(basePage?._selectors?.govukButton).should('include.text', 'Submit comments').click();
  });

  it('should allow a user to enter a reference number and start the process', () => {
    // Validate reference number text field label   
    cy.visit(`${Cypress.config('appeals_beta_base_url')}/comment-planning-appeal`);
    cy.get(basePage?._selectors?.govukLabelGovukLabel).should('include.text', 'Enter the appeal reference number');
    // Input search by reference number
    cy.get('#appeal-reference').type(appealId);
    cy.advanceToNextPage();
    cy.get('a[href*="your-name"]').click();
    cy.get('#first-name').type('Test First Name WRNS');
    cy.get('#last-name').type('Test Last Name');
    cy.advanceToNextPage();
    cy.get('#address-line-1').type('Address Line One');
    cy.get('#address-line-2').type('Address Line Two');
    cy.get('#address-town').type('Address Town');
    cy.get('#address-county').type('Address County');
    cy.get('#address-postcode').type('SW7 9PB');
    cy.advanceToNextPage();
    cy.get('#email-address').type('commenter@email.com');
    cy.advanceToNextPage();

    cy.get('#comments').type('Interested Party comments with reference number');
    cy.get('#comments-confirmation').check();
    cy.advanceToNextPage();
    cy.get(basePage?._selectors?.govukButton).should('include.text', 'Submit comments').click();
  });
});