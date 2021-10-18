import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import { getPage } from './getPage';

const pageId = 'already-submitted';
const pageTitle =
  'Questionnaire already submitted - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Questionnaire already submitted';

When('LPA Planning Officer is trying to access {string} of already submitted questionnaire', (page) => {
  cy.goToPage(getPage(page));
});

Then('LPA Planning Officer is presented with already submitted page', () => {
  cy.verifyPage(pageId);
  cy.verifyPageTitle(pageTitle);
  cy.verifyPageHeading(pageHeading);
  cy.get('[data-cy="customer-support-mailto-link"]').should('have.attr', 'href').and('include', 'mailto');
  cy.get('[data-cy="call-charges"]').invoke('attr', 'href').then((href) => {
    expect(href).to.contain("https://www.gov.uk/call-charges");
  });
});
