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
  // Click the link by visible text (retrying) to start IP comments
  cy.contains('a', /your name|comment on this appeal/i, { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true });
  ipComments.submitIpComments();
};

export const ipCommentsForPostCode = (prepareAppealData, postCode) => {
  const basePage = new BasePage();
  const ipComments = new IpComments();
  let appealId;
  cy.visit(`${Cypress.config('appeals_beta_base_url')}/comment-planning-appeal`, { retryOnStatusCodeFailure: true });
  cy.get(basePage?._selectors?.govukHeaderLinkGovukHeaderServiceName, { timeout: 20000 })
    .should('include.text', 'Comment on a planning appeal');
  cy.get('a[href*="enter-postcode"]').click();
  // Validate URL
  cy.url().should('include', '/comment-planning-appeal/enter-postcode');
  // Input search by post code
  cy.get(ipComments?._selectors?.postcode).clear().type(postCode);
  cy.advanceToNextPage();

  // Wait for table rows to render
  cy.get(basePage?._selectors.trgovukTableRow, { timeout: 20000 }).should('have.length.greaterThan', 0);

  let found = false;
  cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
    const rowtext = $row.text();
    if (rowtext.includes(prepareAppealData?.commentOpen) && !found) {
      found = true;
      cy.wrap($row).within(() => {
        cy.get('a').each(($link) => {
          const href = $link.attr('href') || '';
            if (href.includes('/comment-planning-appeal/') && href.split('/').pop()) {
              appealId = href.split('/').pop();
              cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
              return false;
            }
        });
      });
    }
  }).then(() => {
    expect(found, 'Appeal with open comment state should be found for postcode search').to.be.true;
  });

  cy.contains('a', /your name|comment on this appeal/i, { timeout: 15000 })
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true });
  ipComments.submitIpComments();
};