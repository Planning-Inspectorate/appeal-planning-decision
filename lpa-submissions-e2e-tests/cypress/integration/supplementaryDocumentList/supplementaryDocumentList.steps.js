import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import {
  addAnother,
  adoptedRadioYes,
  continueButton,
  fileNameInput,
  uploadFile,
} from '../../support/PageObjects/SupplementaryAddDocumentsPageObjects';
import fillAdoptedDate from '../../support/supplementary-add-document/fillAdoptedDate';
import verifySupplementaryDocumentList from '../../support/supplementary-add-document/verifySupplementaryDocumentList';
import { input } from '../../support/PageObjects/common-page-objects';
import { getSubTaskInfo } from '../../support/common/subTasks';

const page = {
  heading: 'Supplementary planning documents',
  section: 'Optional supporting documents',
  title:
    'Supplementary planning documents - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'supplementary-documents/uploaded-documents',
  id: 'supplementaryPlanningDocuments',
};

const supplementaryAddNewDocument = (uploadFileName, fileNameInputValue) => {
  cy.goToPage('supplementary-documents');
  uploadFile().attachFile(uploadFileName);
  fileNameInput().type(fileNameInputValue);
  adoptedRadioYes().check();
  fillAdoptedDate('12', '06', '2021');
  cy.clickSaveAndContinue();
};

Before(() => {
  cy.wrap(page).as('page');
});

Given(
  'Add supplementary document is completed for {string} and document name {string}',
  (uploadDocument, documentName) => {
    supplementaryAddNewDocument(uploadDocument, documentName);
  },
);

When('progress is made to supplementary document list', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.checkPageA11y();
});

When('add another file option is selected', () => {
  addAnother().click();
});

When('continue is selected', () => {
  continueButton().click();
});

When('an answer is saved', () => {
  addAnother().click();
  supplementaryAddNewDocument('upload-file-valid.docx', 'New Mock Document Name');
  continueButton().click();
});

Then('supplementary add document page is presented', () => {
  cy.verifyPage('supplementary-documents');
  cy.verifyPageTitle(
    'Supplementary planning documents - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  );
});

Then('a document has been uploaded', () => {
  uploadFile().attachFile('upload-file-valid.pdf');
});

Then('supplementary document is displayed with name {string}', (documentName) => {
  verifySupplementaryDocumentList(documentName);
});

Then('the LPA Planning Officer is taken to the add document page', () => {
  cy.verifyPage('supplementary-documents');
  cy.verifyPageTitle(
    'Supplementary planning documents - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  );
});

Then('the file list with the the previously entered information is presented', () => {
  verifySupplementaryDocumentList('Mock document name');
});
Then(
  'Supplementary planning documents heading is shown and the uploaded file name should be displayed',
  () => {
    cy.confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
  },
);
