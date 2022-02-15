import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import {
  appealDocumentsSectionLink,
  pageCaptionText,
} from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import {
  getBackLink,
  getErrorMessageSummary,
  getFileUploadButton,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import {
  errorMessageAreYouATenant,
  selectNo,
  selectSomeOf, selectYes,
} from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import {
  checkboxConfirmSensitiveInfo,
  checkboxErrorMessage,
} from '../../../../../support/full-appeal/appeals-service/page-objects/your-appeal-statement-po';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { selectRadioButton } from '../../../../../support/full-appeal/appeals-service/selectRadioButton';
import { plansOrDrawingsErrorMessage } from '../../../../../support/full-appeal/appeals-service/page-objects/file-upload-po';

const Url = 'full-appeal/submit-appeal/plans-drawings';
const appealStatementUrl = 'full-appeal/submit-appeal/appeal-statement';
const plansDrawingUploadUrl = 'full-appeal/submit-appeal/plans-drawings-upload';
const supportingDocumentsUrl ='full-appeal/submit-appeal/supporting-documents';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const textPageCaption = 'Upload documents for your appeal';
const pageTitle = "Plans and drawings - Appeal a planning decision - GOV.UK";
const pageHeading = 'Do you have any new plans or drawings that support your appeal?';
const filename = 'upload-file-valid.doc';

Given("an Appellant or Agent is on the 'Appeal statement' page", () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  appealDocumentsSectionLink().click();
})
When("the user uploads a document and selects the confirm box", () => {
  getFileUploadButton().attachFile(filename);
  checkboxConfirmSensitiveInfo().click();
  getSaveAndContinueButton().click();
})
Then("'Do you have any new plans or drawings that support your appeal' page is displayed", () => {
  cy.url().should('contain', Url);
})

When("the user selects {string} and clicks 'Continue' button", (option) => {
  selectRadioButton(option);
});
Given("an Appellant or Agent is on the 'Do you have any new plans or drawings that support your appeal' page", () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  appealDocumentsSectionLink().click();
  getFileUploadButton().attachFile(filename);
  checkboxConfirmSensitiveInfo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', Url);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
  pageCaptionText().should('contain', textPageCaption);
  cy.checkPageA11y();
})
Then("the user is taken to the next page 'Plans or drawings'", () => {
  cy.url().should('contain', plansDrawingUploadUrl);
})
Then("are taken to the next page 'Supporting Documents'", () => {
  cy.url().should('contain', supportingDocumentsUrl);
})
// Then('they are presented with an error message {string}', (errorMessage) => {
//   verifyErrorMessage(errorMessage,, getErrorMessageSummary);
// });
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
Then("they are presented with the 'Your appeal statement' page with the uploaded file is displayed and confirm checkbox selected", () => {
  cy.url().should('contain', appealStatementUrl);
  //uploaded file should exist
  cy.findAllByText('Uploaded file').should('exist');
  cy.findAllByRole('link', {name: filename});
  // cy.downloadFile('','Downloads',filename);
  //  cy.readFile("./Downloads/filename");
  checkboxConfirmSensitiveInfo().should('be.checked');
});
Then("they are presented with an error message {string}", (errorMessage) => {
  verifyErrorMessage(errorMessage,plansOrDrawingsErrorMessage,getErrorMessageSummary);
});
