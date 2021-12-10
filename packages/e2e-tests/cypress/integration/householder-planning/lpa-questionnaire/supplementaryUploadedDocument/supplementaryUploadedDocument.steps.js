import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import {
  addAnother,
  adoptedRadioYes,
  continueButton,
  fileNameInput,
  uploadFile,
} from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/SupplementaryAddDocumentsPageObjects';
import {fillAdoptedDate} from '../../../../support/householder-planning/lpa-questionnaire/supplementary-add-document/fillAdoptedDate';
import {verifySupplementaryDocumentList} from '../../../../support/householder-planning/lpa-questionnaire/supplementary-add-document/verifySupplementaryDocumentList';
import { goToPage } from '../../../../support/common/go-to-page/goToPage';
import { verifyPage } from '../../../../support/common/verifyPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../support/common/verify-page-heading';
import { verifySectionName } from '../../../../support/common/verifySectionName';
import {
  confirmCheckYourAnswersDisplayed
} from '../../../../support/householder-planning/lpa-questionnaire/check-your-answers/confirmCheckYourAnswersDisplayed';
import { clickSaveAndContinue } from '../../../../support/common/clickSaveAndContinue';

const page = {
  heading: 'Supplementary planning documents',
  section: 'Optional supporting documents',
  title:
    'Supplementary planning documents - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'supplementary-documents/uploaded-documents',
  id: 'supplementaryPlanningDocuments',
};

const supplementaryAddNewDocument = (uploadFileName, fileNameInputValue) => {
  goToPage('supplementary-documents');
  uploadFile().attachFile(uploadFileName);
  fileNameInput().type(fileNameInputValue);
  adoptedRadioYes().check();
  fillAdoptedDate('12', '06', '2021');
  clickSaveAndContinue();
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
  verifyPage(page.url);
  verifyPageTitle(page.title);
  verifyPageHeading(page.heading);
  verifySectionName(page.section);
  cy.checkPageA11y();
});

When('add another file option is selected', () => {
  addAnother().click();
});

When('continue is selected', () => {
  continueButton().click();
});

When('an answer is saved', () => {
  supplementaryAddNewDocument('upload-file-valid.docx', 'New Mock Document Name');
  continueButton().click();
});

Then('supplementary add document page is presented', () => {
  verifyPage('supplementary-documents');
  verifyPageTitle(
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
  verifyPage('supplementary-documents');
  verifyPageTitle(
    'Supplementary planning documents - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  );
});

Then('the file list with the the previously entered information is presented', () => {
  verifySupplementaryDocumentList('Mock document name');
});
Then(
  'Supplementary planning documents heading is shown and the uploaded file name should be displayed',
  () => {
    confirmCheckYourAnswersDisplayed(page.id, 'upload-file-valid.pdf');
  },
);
