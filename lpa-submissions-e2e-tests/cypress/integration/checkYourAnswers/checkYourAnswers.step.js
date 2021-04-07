import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { subTasks } from '../../support/common/subTasks';

const id = 'confirm-answers'
const title =
  'Check your answers - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';
const heading = 'Householder planning appeal questionnaire';

Given('Check Your Answers in presented', () => {
  cy.goToCheckYourAnswersPage();
});

When('Check Your Answers page is displayed', () => {
  cy.goToCheckYourAnswersPage();
});

When('the answers are completed', () => {
  cy.clickSubmitButton();
});

When('the LPA Planning Officer selects a question', () => {
  cy.clickOnSubTaskLink(subTasks[0].id);
});

When('the LPA Planning Officer chooses to go to the previous page', () => {
  cy.clickBackButton();
});

Then('Check Your Answers sub section has a status of NOT STARTED', () => {
  cy.get('li[name="checkYourAnswers"]')
    .find('.govuk-tag')
    .contains('NOT STARTED');
});

Then('the LPA is able to proceed to Check Your Answers', () => {
  cy.clickOnSubTaskLink('checkYourAnswers');
  cy.verifyPage(id);
})

Then('a summary of questions and answers is provided', () => {
  cy.verifyPage(id);
  cy.verifyPageTitle(title);
  cy.verifyPageHeading(heading);
  cy.checkPageA11y();

  cy.confirmCheckYourAnswersDisplayed('accurateSubmission', 'No');
  cy.confirmCheckYourAnswersDisplayed('inaccuracyReason', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.');
  cy.confirmCheckYourAnswersDisplayed('hasExtraConditions', 'Yes');
  cy.confirmCheckYourAnswersDisplayed('extraConditions', 'Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis.\n\nSed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.');
  cy.confirmCheckYourAnswersDisplayed('adjacentAppeals', 'Yes');
  cy.confirmCheckYourAnswersDisplayed('appealReferenceNumbers', 'abc-123, def-456');
  cy.confirmCheckYourAnswersDisplayed('plansDecision', 'upload-file-valid.pdf');
  cy.confirmCheckYourAnswersDisplayed('hasPlanSubmitted', 'Yes');
  cy.confirmCheckYourAnswersDisplayed('planChanges', 'mock plan changes');
});

Then('Then the data is submitted', () => {
  cy.verifyPage('information-submitted');
});

Then('user is returned to the Check your answers page', () => {
  cy.verifyPage(id);
})
