import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import {
  appealDocumentsSectionLink,
  pageCaptionText,
} from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';
import {
  getBackLink,
  getErrorMessageSummary,
  getFileUploadButton, getPageHeading,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import {
  checkboxConfirmSensitiveInfo,
} from '../../../../../support/full-appeal/appeals-service/page-objects/your-appeal-statement-po';
import {selectNo} from '../../../../../support/full-appeal/appeals-service/page-objects/own-the-land-po';
import { selectRadioButton } from '../../../../../support/full-appeal/appeals-service/selectRadioButton';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { supportingDocumentsErrorMessage } from '../../../../../support/full-appeal/appeals-service/page-objects/file-upload-po';


const Url = 'full-appeal/submit-appeal/supporting-documents';
const plansDrawingsUrl = 'full-appeal/submit-appeal/plans-drawings';
const supportingDocumentsUrl ='full-appeal/submit-appeal/supporting-documents';
const newSupportingDocumentsUrl = 'full-appeal/submit-appeal/new-supporting-documents';
const taskListUrl = 'full-appeal/submit-appeal/task-list';
const textPageCaption = 'Upload documents for your appeal';
const supportingDocumentsPageHeading = 'Supporting documents';
const pageTitle = "Supporting documents - Appeal a planning decision - GOV.UK";
const pageHeading = 'Do you want to submit any new supporting documents with your appeal?';
const filename = 'upload-file-valid.doc';

Given("an Appellant or Agent is on the 'New plans or drawings' page", () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  appealDocumentsSectionLink().click();
  getFileUploadButton().attachFile(filename);
  checkboxConfirmSensitiveInfo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', plansDrawingsUrl);
});
Then("'Do you want to submit any new supporting documents with your appeal?' page is displayed", () => {
  cy.url().should('contain', supportingDocumentsUrl);
  verifyPageTitle(pageTitle);
  getPageHeading(supportingDocumentsPageHeading).should('exist');
  verifyPageHeading(pageHeading);
  pageCaptionText().should('contain', textPageCaption);
  cy.checkPageA11y();
});
Given("an Appellant or Agent is on the 'Supporting documents' page", () => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
  appealDocumentsSectionLink().click();
  getFileUploadButton().attachFile(filename);
  checkboxConfirmSensitiveInfo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', plansDrawingsUrl);
  selectNo().click();
  getSaveAndContinueButton().click();
  cy.url().should('contain', Url);
  });
Then("the user is taken to the next page 'New supporting documents' page", () => {
  cy.url().should('contain', newSupportingDocumentsUrl);
});
When("they select {string} and clicks 'Continue' button", (option) => {
  selectRadioButton(option);
  });
Then("are taken back to the task list page", () => {
  cy.url().should('contain', taskListUrl);
});
Then("they are presented with the 'New plans or drawings' page and the option is selected'", () => {
  cy.url().should('contain', plansDrawingsUrl);
  selectNo().should('be.checked');
});
Then('they are presented with an error message {string}', (errorMessage) => {
  verifyErrorMessage(errorMessage,supportingDocumentsErrorMessage, getErrorMessageSummary);
});
When("they click on the 'Back' link",()=> {
  getBackLink().click();
});
