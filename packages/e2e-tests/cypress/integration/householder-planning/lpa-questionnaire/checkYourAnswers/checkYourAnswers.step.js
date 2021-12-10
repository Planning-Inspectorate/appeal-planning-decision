import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { subTasks } from '../../../../support/common/subTasks';
import {
  completeQuestionnaire
} from '../../../../support/householder-planning/lpa-questionnaire/completeQuestionnaire';
import {
  goToCheckYourAnswersPage
} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/goToCheckYourAnswersPage';
import { clickSubmitButton } from '../../../../support/common/clickSubmitButton';
import { clickOnSubTaskLink } from '../../../../support/common/clickOnSubTaskLink';
import { getBackLink } from '../../../../support/common-page-objects/common-po';
import { verifyPage } from '../../../../support/common/verifyPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import {
  confirmCheckYourAnswersDisplayed
} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayed';

const id = 'confirm-answers'
const title =
  'Check your answers - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';
const heading = 'Check your answers';

Given('Check Your Answers is presented for LPA Questionnaire', () => {
  completeQuestionnaire();
  goToCheckYourAnswersPage();
});

When('Check Your Answers page is displayed', () => {
  completeQuestionnaire();
  goToCheckYourAnswersPage();
});

When('the answers are completed', () => {
  clickSubmitButton();
});

When('the LPA Planning Officer selects a question', () => {
  clickOnSubTaskLink(subTasks[0].id);
});

When('the LPA Planning Officer chooses to go to the previous page', () => {
  getBackLink().click();
});

Then('Check Your Answers sub section has a status of NOT STARTED', () => {
  cy.get('li[name="checkYourAnswers"]')
    .find('.govuk-tag')
    .contains('NOT STARTED');
});

Then('the LPA is able to proceed to Check Your Answers', () => {
  clickOnSubTaskLink('checkYourAnswers');
  verifyPage(id);
})

Then('a summary of questions and answers is provided', () => {
  verifyPage(id);
  verifyPageTitle(title);
  verifyPageHeading(heading);
  cy.checkPageA11y();

  confirmCheckYourAnswersDisplayed('submissionAccuracy', 'No');
  confirmCheckYourAnswersDisplayed('submissionAccuracy', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.');
  confirmCheckYourAnswersDisplayed('extraConditions', 'Yes');
  confirmCheckYourAnswersDisplayed('extraConditions', 'Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis.\n\nSed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.');
  confirmCheckYourAnswersDisplayed('otherAppeals', 'Yes');
  confirmCheckYourAnswersDisplayed('otherAppeals', 'abc-123, def-456');
  confirmCheckYourAnswersDisplayed('plansDecision', 'upload-file-valid.pdf');
  confirmCheckYourAnswersDisplayed('developmentOrNeighbourhood', 'Yes');
  confirmCheckYourAnswersDisplayed('developmentOrNeighbourhood', 'mock plan changes');
});

Then('progress is made to the submission confirmation page', () => {
  verifyPage('information-submitted');
});

Then('user is returned to the Check your answers page', () => {
  verifyPage(id);
})
