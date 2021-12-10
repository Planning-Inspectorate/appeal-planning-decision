import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import {verifyDeleteConfirmationText} from '../../../../support/householder-planning/lpa-questionnaire/supplementary-add-document/verifyDeleteConfirmationText';
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
} from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/SupplementaryAddDocumentsPageObjects';
import {fillAdoptedDate} from '../../../../support/householder-planning/lpa-questionnaire/supplementary-add-document/fillAdoptedDate';
import {verifySupplementaryDocumentList} from '../../../../support/householder-planning/lpa-questionnaire/supplementary-add-document/verifySupplementaryDocumentList';
import { goToPage } from '../../../../support/common/go-to-page/goToPage';
import { verifyPage } from '../../../../support/common/verifyPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifySectionName } from '../../../../support/common/verifySectionName';
import { clickSaveAndContinue } from '../../../../support/common/clickSaveAndContinue';
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
  goToPage('supplementary-documents');
  uploadFile().attachFile(uploadFileName);
  fileNameInput().type(fileNameInputValue);
  adoptedRadioYes().check();
  fillAdoptedDate('12', '06', '2021');
  clickSaveAndContinue();
};

Given('progress is made to supplementary document list', () => {
  verifyPage('supplementary-documents/uploaded-documents');
  verifyPageTitle(
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
  verifyPage(page.url);
  verifyPageTitle(page.title);
  verifyPageHeading(page.heading);
  verifySectionName(page.section);
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
  verifyPage(page.url);
  verifyPageTitle(page.title);
  verifyPageHeading(page.heading);
  verifySectionName(page.section);
  cy.checkPageA11y();
});

Then('progress is made to supplementary planning add document page', () => {
  verifyPage('supplementary-documents');
  verifyPageTitle(
    'Supplementary planning documents - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  );
});

Then('supplementary document {string} should be visible', (documentName) => {
  getDocumentName().should('be.visible');
  verifySupplementaryDocumentList(documentName);
});
