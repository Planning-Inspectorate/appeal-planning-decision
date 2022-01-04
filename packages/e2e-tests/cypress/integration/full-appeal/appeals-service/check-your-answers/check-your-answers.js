import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { verifyPageTitle } from '../../../../../../../e2e-tests/cypress/support/common/verify-page-title';
import {
  CheckYourAnswersLink, getPageCaption, getPlanningAppMadeInYourName, getSectionHeading, yourContactDetails,
} from '../../../../support/full-appeal/appeals-service/page-objects/check-your-answers-po';
import { getBackLink } from '../../../../support/common-page-objects/common-po';
import { verifyPageHeading } from '../../../../../../../e2e-tests/cypress/support/common/verify-page-heading';

const url = 'localhost:9003/full-appeal/submit-appeal/task-list';
const pageTitle = 'Check your answers - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Check your answers';

Given("the appellant is on the 'Appeal a planning decision' page", () => {
  cy.visit(url);
})
When("they click on 'Check your answers and submit your appeal' link", () => {
  CheckYourAnswersLink().click();
})
Then('the information they have inputted will be displayed', () => {
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
  getSectionHeading().should('exist');
  getPageCaption().should('exist');
  getPlanningAppMadeInYourName().should('exist');
  getPlanningAppMadeInYourName().siblings('dd').should('contain', "No, I'm an agent acting on behalf of the applicant");
  yourContactDetails().should('contain', 'Your contact details');
})
Given("the agent is on the 'Appeal a planning decision' page", () => {
  cy.visit(url);
})
Given("the {string} is on the 'Check your answers' page", () => {
  cy.visit(url);
  CheckYourAnswersLink().click();
  verifyPageTitle(pageTitle);
})
When("they select the 'Back' link", () => {
  getBackLink().click();
})
Then("the {string} is on the 'Appeal a planning decision' page", () => {
  cy.url().should('contain', '/full-appeal/submit-appeal/task-list');
})
