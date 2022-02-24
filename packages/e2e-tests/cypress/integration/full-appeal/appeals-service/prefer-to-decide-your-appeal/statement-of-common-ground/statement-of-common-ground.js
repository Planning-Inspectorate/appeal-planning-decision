import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToFullAppealSubmitAppealTaskList } from '../../../../../support/full-appeal/appeals-service/goToFullAppealSubmitAppealTaskList';
import { linkDecideYourAppeal } from '../../../../../support/full-appeal/appeals-service/page-objects/appeal-form-task-list-po';
import {
  selectHearing, selectInquiry, textBoxExpectDays, textBoxInquiry,
  textBoxWhyHearing,
} from '../../../../../support/full-appeal/appeals-service/page-objects/decide-your-appeal-po';
import {
  getBackLink,
  getErrorMessageSummary,
  getFileUploadButton,
  getSaveAndContinueButton,
} from '../../../../../support/common-page-objects/common-po';
import { verifyErrorMessage } from '../../../../../support/common/verify-error-message';
import {
  errorFileUploadField, uploadedFileLabel,
  uploadedFileLabelMultipleFiles, uploadedFileName,
} from '../../../../../support/full-appeal/appeals-service/page-objects/file-upload-po';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { pageCaptionText } from '../../../../../support/full-appeal/appeals-service/page-objects/task-list-page-po';

const taskListUrl = 'full-appeal/submit-appeal/task-list';
const decideAppealUrl = 'full-appeal/submit-appeal/how-decide-appeal';
const whyHearingUrl = 'full-appeal/submit-appeal/why-hearing';
const whyInquiryUrl = 'full-appeal/submit-appeal/why-inquiry';
const daysToExpectTheInquiry = 'full-appeal/submit-appeal/expect-inquiry-last';
const Url = 'full-appeal/submit-appeal/draft-statement-common-ground';
const textPageCaption = 'Tell us how you would prefer us to decide your appeal';
const pageTitle = 'Upload your draft statement of common ground - Appeal a planning decision - GOV.UK';
const pageHeading = 'Upload your draft statement of common ground';
const textHearing = 'I want to provide the facts of the Appeal for the formal decision';
const textInquiry = 'I want to take part in the inquiry process - 123456789';
const dragDropFileText = 'Drag and drop or choose a file';
const validNumberDays = 10;
const validFilename1 = 'upload-file-valid.doc';

Given('appellant has completed full appeal eligibility journey',() => {
  goToFullAppealSubmitAppealTaskList('before-you-start/local-planning-depart','Full planning');
});

Given("the Appellant or Agent is on the 'Why would you prefer a hearing' page", () => {
  cy.url().should('contain', taskListUrl);
  linkDecideYourAppeal().click();
  cy.url().should('include', decideAppealUrl);
  selectHearing().click();
  getSaveAndContinueButton().click();
  cy.url().should('include', whyHearingUrl);
});
When("they have entered text in the 'text box' and click 'Continue' for Hearing", () => {
  textBoxWhyHearing().clear().type(textHearing);
  getSaveAndContinueButton().click();
});
Then("the 'Upload your draft statement of common ground' page is displayed", () => {
  cy.url().should('include', Url);
  verifyPageHeading(pageHeading);
  verifyPageTitle(pageTitle);
  pageCaptionText().should('contain',textPageCaption);
  cy.checkPageA11y();
});
Given("the Appellant or Agent is on the 'How many days would you expect the inquiry to last?' page", () => {
  cy.url().should('contain', taskListUrl);
  linkDecideYourAppeal().click();
  cy.url().should('include', decideAppealUrl);
  selectInquiry().click();
  getSaveAndContinueButton().click();
  cy.url().should('include', whyInquiryUrl);
  textBoxInquiry().clear().type(textInquiry);
  getSaveAndContinueButton().click();
  cy.url().should('include', daysToExpectTheInquiry);
});
When("they have entered text in the 'text box' and click 'Continue' for Inquiry", () => {
  textBoxExpectDays().clear().type(validNumberDays);
  getSaveAndContinueButton().click();
});
Then("the 'Upload your draft statement of common ground' page is displayed", () => {
  cy.url().should('include', Url);
});

Given("the Appellant or Agent is on the 'Upload your draft statement of common ground' page for {string}", (decideAppeal) => {
  switch (decideAppeal){
    case "Hearing":
      cy.url().should('contain', taskListUrl);
      linkDecideYourAppeal().click();
      cy.url().should('include', decideAppealUrl);
      selectHearing().click();
      getSaveAndContinueButton().click();
      textBoxWhyHearing().clear().type(textHearing);
      getSaveAndContinueButton().click();
      cy.url().should('include', Url);
      break;
    case "Inquiry":
      cy.url().should('contain', taskListUrl);
      linkDecideYourAppeal().click();
      cy.url().should('include', decideAppealUrl);
      selectInquiry().click();
      getSaveAndContinueButton().click();
      cy.url().should('include', whyInquiryUrl);
      textBoxInquiry().clear().type(textInquiry);
      getSaveAndContinueButton().click();
      cy.url().should('include', daysToExpectTheInquiry);
      textBoxExpectDays().clear().type(validNumberDays);
      getSaveAndContinueButton().click();
      cy.url().should('include', Url);
      break;
  }
});
When("they add valid files through 'Choose files' or 'drag and drop' and click 'Continue'", () => {
  getFileUploadButton().attachFile ([validFilename1], { subjectType: 'drag-n-drop' });
  getSaveAndContinueButton().click();
});
Then("they are returned to the task list", () => {
  cy.url().should('include', taskListUrl);
});
Given("the Appellant or Agent has uploaded {string} as {string} in the 'Upload your draft statement of common ground' page", (filetype, fileName) => {
  if(fileName === "") {
    cy.url().should( 'contain', taskListUrl);
    linkDecideYourAppeal().click();
    cy.url().should( 'include', decideAppealUrl);
    selectHearing().click();
    getSaveAndContinueButton().click();
    textBoxWhyHearing().clear().type(textHearing);
    getSaveAndContinueButton().click();
    cy.url().should( 'include', Url);
  }
    else
    {
      cy.url().should( 'contain', taskListUrl);
      linkDecideYourAppeal().click();
      cy.url().should( 'include', decideAppealUrl);
      selectHearing().click();
      getSaveAndContinueButton().click();
      textBoxWhyHearing().clear().type(textHearing);
      getSaveAndContinueButton().click();
      cy.url().should( 'include', Url);
      getFileUploadButton().attachFile(fileName);
    }
});
When("they click on 'Continue' button", () => {
  getSaveAndContinueButton().click();
});
Then("the file {string} {string} is displayed", (filename, errormessage) => {
  const fileName = filename + ' ' + errormessage;
  verifyErrorMessage(fileName,errorFileUploadField, getErrorMessageSummary);
});
When("they click on the browser back button for the journey {string}", () => {
    cy.go('back');
});
Then("they are on the 'Upload your draft statement of common ground' page for {string} and can see the uploaded file", (decideAppeal) => {
  switch (decideAppeal){
    case "Hearing":
      cy.url().should('include', Url);
      uploadedFileLabel().should('exist');
      uploadedFileName().should('contain', validFilename1);
    break;
    case "Inquiry":
      cy.url().should('include', Url);
      uploadedFileLabel().should('exist');
      uploadedFileName().should('contain', validFilename1);
      break;
  }
});
When("they click on the 'Back' link then they are on the relevant {string}", (page) => {
  switch (page){
    case "Why would you prefer a hearing":
      cy.url().should('include', Url);
      getBackLink().click();
      cy.url().should('include', whyHearingUrl);
      break;
    case "How many days would you expect the inquiry to last":
      cy.url().should('include', Url);
      getBackLink().click();
      cy.url().should('include', daysToExpectTheInquiry);
      break;
  }
});
Then("they can see the previously entered text for {string}", (decideAppeal) => {
  switch (decideAppeal){
    case "Hearing":
      cy.url().should('include', whyHearingUrl);
      textBoxWhyHearing().should('contain', textHearing);
    break;
    case "Inquiry":
      cy.url().should('include', daysToExpectTheInquiry);
      textBoxExpectDays().should('have.value', validNumberDays);
    break;
  }
});

