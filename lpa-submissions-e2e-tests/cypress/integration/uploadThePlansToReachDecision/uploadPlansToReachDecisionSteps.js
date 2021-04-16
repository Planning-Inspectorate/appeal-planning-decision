import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import defaultPathId from '../../utils/defaultPathId';

const page = {
  id: 'plansDecision',
  heading: 'Upload the plans used to reach the decision',
  section: 'Required documents',
  title: 'Upload plans used to reach the decision - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'plans',
}

let disableJs = false;

const goToUploadDecisionPage = () => {
  cy.goToPage(page.url, undefined, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('Upload the plans used to reach the decision question is requested', () => {
  goToUploadDecisionPage();
});

When('LPA Planning Officer chooses to upload plans used to reach the decision', () => {
  cy.clickOnTaskListLink(page.id);
  cy.verifyPage(page.url);
});

When('the plans used to reach the decision question is requested', () => {
  goToUploadDecisionPage();
});

Then('LPA Planning Officer is presented with the ability to upload plans', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.checkPageA11y(`/${defaultPathId}/${page.url}`);
});

Then('Upload the plans used to reach the decision subsection is shown as completed', () => {
  cy.verifyCompletedStatus(page.id);
});
