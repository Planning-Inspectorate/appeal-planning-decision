/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
import { IpComments } from "../../pages/ip-comments/ipComments";

export const ipCommentsForAppealRef = (appealId) => {
  const basePage = new BasePage();
  const ipComments = new IpComments();
  cy.visit(`${Cypress.config('appeals_beta_base_url')}/comment-planning-appeal/enter-appeal-reference`);    
  cy.url().should('include', '/comment-planning-appeal/enter-appeal-reference');
  cy.get(basePage?._selectors?.govukLabelGovukLabel).should('include.text', 'Enter the appeal reference number');
  // Input search by reference number
  cy.get(ipComments?._selectors.appealReference).type(appealId);
  cy.advanceToNextPage();
  cy.get('a[href*="your-name"]').click({ force: true });
  ipComments.submitIpComments();
};

export const ipCommentsForPostCode = (prepareAppealData, postCode) => {
  const basePage = new BasePage();
  const ipComments = new IpComments();
  let appealId;
  cy.visit(`${Cypress.config('appeals_beta_base_url')}/comment-planning-appeal`);
  cy.get(basePage?._selectors?.govukHeaderLinkGovukHeaderServiceName).should('include.text', 'Comment on a planning appeal');
  cy.get('a[href*="enter-postcode"]').click();
  // Validate URL
  cy.url().should('include', '/comment-planning-appeal/enter-postcode');
  // Input search by post code
  cy.get(ipComments?._selectors?.postcode).type(postCode);
  cy.advanceToNextPage();
  // cy.visit(`${Cypress.config('appeals_beta_base_url')}/comment-planning-appeal/enter-appeal-reference`);
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
  cy.get('a[href*="your-name"]').click({ force: true });
  ipComments.submitIpComments();
};