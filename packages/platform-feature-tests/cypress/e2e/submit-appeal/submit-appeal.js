import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { BasePage } from '../../page-objects/base-page';
import { BeforeYouStart } from '../../page-objects/appeals-sections/before-you-start';

const basePage = new BasePage;
const beforeYouStart = new BeforeYouStart;

Given('appellant is on the Before You Start first page', () => {
  cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`); // navigates to the appeals url
  basePage.verifyPageHeading('Before you start'); // verifies that you are on the right page
  });

  Then('appellant clicks on the continue button', () => {
    basePage.clickContinueBtn(); // clicks on the contiune button  
  });

  Then('appellant is navigated to the Local Planning Department page', () =>  {
    cy.url().should('include', 'local-planning-department'); // makes sure we are on the correct local planning page
  });

  Then('appellant enters local planning authority', () =>  {
    beforeYouStart.enterLPA('System Test Borough Council');
    beforeYouStart.selectLPA();
  });

  Then('appellant clicks on the continue button', () => {
    basePage.clickContinueBtn(); // clicks on the contiune button  
  });