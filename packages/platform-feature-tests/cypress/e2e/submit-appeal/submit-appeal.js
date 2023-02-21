import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { basePage } from '../../page-objects/base-page';

const BasePage = new basePage;


Given('appellant is on the Before You Start first page', function() {
  cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`); // navigates to the 
  BasePage.verifyPageHeading('Before you start'); // 
  });

  When('appellant clicks on the continue button', function() {
    BasePage.clickContiuneBtn(); // clicks on the contiune button  
  });

  Then('appellant is navigated to the Local Planning Department page', () => {
    cy.url().should('include', 'local-planning-department');
  });
  

  