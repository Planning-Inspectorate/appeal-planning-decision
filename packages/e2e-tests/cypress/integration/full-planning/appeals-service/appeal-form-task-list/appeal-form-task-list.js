import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { verifyPageTitle } from '../../../../../../../e2e-tests/cypress/support/common/verify-page-title';
import {
  applicationStatusDetailedText,
  applicationStatusText,
  linkProvideYourContactDetails,
  linkTellAboutTheAppealSite,
  linkUploadDocsFromPlanningApplication,
  linkUploadDocsForYourAppeal,
  linkCheckYourAnswers,
  var1,
  statusProvideYourContactDetails,
  statusTellAboutTheAppealSite,
  statusUploadDocsFromPlanningApplication,
  statusUploadDocsForYourAppeal, statusCheckYourAnswers,
} from '../../../../support/full-planning/appeals-service/page-objects/appeal-form-task-list-po';

const pageHeading = 'Appeal a planning decision';
const url = '/full-appeal/task-list';
const pageTitle = 'Appeal a planning decision - Appeal a planning decision - GOV.UK';

Given('Appellant has been successful on their eligibility',()=> {
 cy.visit('http://localhost:9003/full-appeal/task-list');
})
When("they are on the 'Appeal a Planning Decision' page",()=> {
  verifyPageTitle(pageTitle);

})
Then('they are presented with the list of tasks that they are required to complete in order to submit their appeal',()=> {
  linkProvideYourContactDetails().should('exist');
  statusProvideYourContactDetails().should('exist');
  linkTellAboutTheAppealSite().should('exist');
  statusTellAboutTheAppealSite().should('exist');
  linkUploadDocsFromPlanningApplication().should('exist');
  statusUploadDocsFromPlanningApplication().should('exist');
  linkUploadDocsForYourAppeal().should('exist');
  statusUploadDocsForYourAppeal().should('exist');
  linkCheckYourAnswers().should('exist');
  statusCheckYourAnswers().should('exist');
})
Then('when a section has been completed they are able to see what has been completed or incompleted',()=> {
  applicationStatusText().should('exist');
  applicationStatusDetailedText().should('exist');
})

