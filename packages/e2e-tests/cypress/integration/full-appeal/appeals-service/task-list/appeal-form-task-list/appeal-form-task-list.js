import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  applicationStatusDetailedText,
  applicationStatusText,
  linkProvideYourContactDetails,
  linkTellAboutTheAppealSite,
  linkUploadDocsFromPlanningApplication,
  linkUploadDocsForYourAppeal,
  linkCheckYourAnswers,
  statusProvideYourContactDetails,
  statusTellAboutTheAppealSite,
  statusUploadDocsFromPlanningApplication,
  statusUploadDocsForYourAppeal, statusCheckYourAnswers, linkDecideYourAppeal,
} from '../../../../../support/full-appeal/appeals-service/page-objects/appeal-form-task-list-po';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';

const pageHeading = 'Appeal a planning decision';
const url = 'full-appeal/submit-appeal/task-list';
const decideYourAppealUrl = 'full-appeal/submit-appeal/how-decide-appeal';
const pageTitle = 'Appeal a planning decision - Appeal a planning decision - GOV.UK';

Given('Appellant has been successful on their eligibility',()=> {
  cy.url().should('contain', url);
})
When("they are on the 'Appeal a Planning Decision' page",()=> {
  cy.url().should('contain', url);
  verifyPageTitle(pageTitle);
  verifyPageHeading(pageHeading);
});
Then('they are presented with the list of tasks that they are required to complete in order to submit their appeal',()=> {
  linkProvideYourContactDetails().should('exist');
  statusProvideYourContactDetails().should('exist');
  linkTellAboutTheAppealSite().should('exist');
  statusTellAboutTheAppealSite().should('exist');
  linkDecideYourAppeal().should('exist');
  linkUploadDocsFromPlanningApplication().should('exist');
  statusUploadDocsFromPlanningApplication().should('exist');
  linkUploadDocsForYourAppeal().should('exist');
  // the below step needs tp be executed when the status is displayed
  //statusUploadDocsForYourAppeal().should('exist');
  linkCheckYourAnswers().should('exist');
  statusCheckYourAnswers().should('exist');
});
Then('when a section has been completed they are able to see what has been completed or incompleted',()=> {
  applicationStatusText().should('exist');
  applicationStatusDetailedText().should('exist');
});
Given("that user is on the Appeal a Planning Decision task list", () => {
  cy.url().should('contain', 'full-appeal/submit-appeal/task-list');
});
When("the user click on 'Tell us how you would prefer us to decide your appeal'", () => {
  linkDecideYourAppeal().click();
});
Then("the user is taken to the 'How would you prefer us to decide your appeal? page", () => {
  cy.url().should('include', decideYourAppealUrl);
});

