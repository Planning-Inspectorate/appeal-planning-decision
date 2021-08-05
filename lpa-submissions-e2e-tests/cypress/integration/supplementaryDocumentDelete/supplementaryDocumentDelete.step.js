import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import verifyDeleteConfirmationText from '../../support/supplementary-add-document/verifyDeleteConfirmationText';
import {
  addAnother,
  adoptedRadioYes,
  fileNameInput,
  getCancelButton,
  getCheckbox,
  getDeleteButton,
  getDeleteLink,
  getDocumentName,
  uploadFile,
} from '../../support/PageObjects/SupplementaryAddDocumentsPageObjects';
import fillAdoptedDate from '../../support/supplementary-add-document/fillAdoptedDate';
import verifySupplementaryDocumentList from '../../support/supplementary-add-document/verifySupplementaryDocumentList';

const page = {
  heading: 'Delete a supplementary planning document',
  section: 'Optional supporting documents',
  title:
    'Delete a supplementary planning document - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'supplementary-documents/delete-document?row=0',
  id: 'supplementaryPlanningDocuments',
};

Before(() => {
  cy.wrap(page).as('page');
});

const supplementaryAddNewDocument = (uploadFileName, fileNameInputValue) => {
  cy.goToPage('supplementary-documents');
  uploadFile().attachFile(uploadFileName);
  fileNameInput().type(fileNameInputValue);
  adoptedRadioYes().check();
  fillAdoptedDate('12', '06', '2021');
  cy.clickSaveAndContinue();
};

Given('progress is made to supplementary document list', () => {
  cy.verifyPage('supplementary-documents/uploaded-documents');
  cy.verifyPageTitle(
    'Supplementary planning documents - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  );
});

Given(
  'Add supplementary document is completed for {string} and document name {string}',
  (uploadDocument, documentName) => {
    supplementaryAddNewDocument(uploadDocument, documentName);
  },
);

Given('progress is made to delete supplementary page', () => {
  getDocumentName().should('be.visible');
  getDeleteLink().click();
  getDocumentName().should('be.visible');
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.checkPageA11y();
});

Given('add another file option is selected', () => {
  addAnother().click();
});

Given('the LPA planning officer confirms deletion', () => {
  verifyDeleteConfirmationText();
  getDeleteButton().should('be.disabled');
  getCheckbox().should('not.be.checked').click();
  getDeleteButton().should('not.be.disabled');
});

When('LPA planning officer selects to delete {string} file', (documentName) => {
  getDocumentName().should('be.visible');
  verifySupplementaryDocumentList(documentName);
  getDeleteLink().click();
});
When('the file is deleted', () => {
  getDeleteButton().should('not.be.disabled').click();
});

When('cancel is selected', () => {
  getCancelButton().should('not.be.disabled');
  getCancelButton().click();
});

When('the LPA planning officer does not confirms deletion', () => {
  getCheckbox().should('not.be.checked');
  getDeleteButton().should('be.disabled');
});

Then('LPA is not able to delete a file', () => {
  getDeleteButton().should('be.disabled');
});

Then('delete supplementary planning page is presented', () => {
  getDocumentName().should('be.visible');
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.checkPageA11y();
});

Then('progress is made to supplementary planning add document page', () => {
  cy.verifyPage('supplementary-documents');
  cy.verifyPageTitle(
    'Supplementary planning documents - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  );
});

Then('supplementary document {string} should be visible', (documentName) => {
  getDocumentName().should('be.visible');
  verifySupplementaryDocumentList(documentName);
});
