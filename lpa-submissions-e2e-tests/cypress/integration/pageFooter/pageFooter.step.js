import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const clickFooterLink = (footerLink) => {
  if (footerLink === 'Privacy') {
    cy.get('[data-cy=Privacy]').click();
  } else if (footerLink === 'Cookies') {
    cy.get('[data-cy=Cookies]').click();
  } else if (footerLink === 'Accessibility') {
    cy.get('[data-cy=Accessibility]').click();
  } else if (footerLink === 'Terms and Conditions') {
    cy.get('[data-cy="Terms and conditions"]').click();
  }
};

Given('LPA planning officer accesses the LPA Questionnaire', () => {
  cy.goToTaskListPage();
});

When('they click on the {string} in the footer', (footerLink) => {
  clickFooterLink(footerLink);
});
Then('the {string} correct page should be displayed', (pageUrl) => {
  cy.verifyPage(pageUrl);
});

Then('the page title should be {string}', (pageTitle) => {
  cy.verifyPageTitle(pageTitle);
});
