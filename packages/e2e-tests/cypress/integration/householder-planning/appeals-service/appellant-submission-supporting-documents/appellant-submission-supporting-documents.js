import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { uploadSupportingDocuments } from '../../../../support/householder-planning/appeals-service/appellant-submission-supporting-documents/uploadSupportingDocuments';
import { clickUploadFiles } from '../../../../support/householder-planning/appeals-service/appellant-submission-supporting-documents/clickUploadFiles';
import { clickSaveAndContinue } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { confirmNumberSupportingDocumentsAccepted } from '../../../../support/householder-planning/appeals-service/appellant-submission-supporting-documents/confirmNumberSupportingDocumentsAccepted';
import { confirmSupportingDocumentAccepted } from '../../../../support/householder-planning/appeals-service/appellant-submission-supporting-documents/confirmSupportingDocumentAccepted';
import { confirmSupportingDocumentRejectedBecause } from '../../../../support/householder-planning/appeals-service/appellant-submission-supporting-documents/confirmSupportingDocumentRejectedBecause';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../common/householder-planning/appeals-service/pageURLAppeal';
import { fileUploadButton } from '../../../../support/householder-planning/appeals-service/page-objects/common-po';

const VALID_DOCUMENTS = [
  'appeal-statement-valid.doc',
  'appeal-statement-valid.docx',
  'appeal-statement-valid.pdf',
  'appeal-statement-valid.tif',
];

const OTHER_VALID_DOCUMENTS = [
  'appeal-statement-valid.png',
  'appeal-statement-valid.jpeg',
  'appeal-statement-valid.jpg',
];

const INVALID_DOCUMENTS = [
  'appeal-statement-invalid-wrong-type.csv',
  'appeal-statement-invalid-wrong-type.mp3',
];

Given('the supporting document page is displayed', () => {
  goToAppealsPage(pageURLAppeal.goToSupportingDocumentsPage);
});

Given('supporting document {string} being submitted', (fileName) => {
  goToAppealsPage(pageURLAppeal.goToSupportingDocumentsPage);
  uploadSupportingDocuments(fileName);
  clickUploadFiles();
});

Given('multiple documents were previously submitted', () => {
  goToAppealsPage(pageURLAppeal.goToSupportingDocumentsPage);
  uploadSupportingDocuments(OTHER_VALID_DOCUMENTS);
  clickUploadFiles();
});

Given('multiple valid and invalid documents were previously uploaded', () => {
  goToAppealsPage(pageURLAppeal.goToSupportingDocumentsPage);
  uploadSupportingDocuments(INVALID_DOCUMENTS.concat(OTHER_VALID_DOCUMENTS));
  clickUploadFiles();
});

When('no document is uploaded', () => {
  clickSaveAndContinue();
});

When('a valid document {string} is uploaded', (validFileName) => {
  uploadSupportingDocuments(validFileName);
  clickSaveAndContinue();
});

When('an invalid document {string} is uploaded', (invalidFileName) => {
  uploadSupportingDocuments(invalidFileName);
  clickSaveAndContinue();
});

When('multiple valid documents are uploaded simultaneously', () => {
  uploadSupportingDocuments(VALID_DOCUMENTS);
  clickSaveAndContinue();
});

When('multiple invalid documents are uploaded simultaneously', () => {
  uploadSupportingDocuments(INVALID_DOCUMENTS);
  clickSaveAndContinue();
});

When('mix of valid and invalid documents are uploaded simultaneously', () => {
  uploadSupportingDocuments(VALID_DOCUMENTS.concat(INVALID_DOCUMENTS));
  clickSaveAndContinue();
});

Then('no document are submitted', () => {
  confirmNumberSupportingDocumentsAccepted(0);
});

Then('document {string} is submitted', (fileName) => {
  confirmSupportingDocumentAccepted(fileName);
});

Then('both document {string} and {string} are submitted', (fileName1, fileName2) => {
  confirmNumberSupportingDocumentsAccepted(2);
  confirmSupportingDocumentAccepted(fileName1);
  confirmSupportingDocumentAccepted(fileName2);
});

Then('document {string} is not submitted because {string}', (fileName, reason) => {
  switch (reason) {
    case 'file type is invalid':
      confirmSupportingDocumentRejectedBecause(fileName + ' must be a');
      break;
    case 'file size exceeds limit':
      confirmSupportingDocumentRejectedBecause(fileName + ' must be smaller than');
      break;
  }
  cy.title().should('include', 'Error: ')
});

Then('all the documents are submitted', () => {
  confirmSupportingDocumentAccepted(VALID_DOCUMENTS);
  confirmNumberSupportingDocumentsAccepted(VALID_DOCUMENTS.length);
});

Then('the documents are added to the previous ones', () => {
  confirmSupportingDocumentAccepted(VALID_DOCUMENTS.concat(OTHER_VALID_DOCUMENTS));

  confirmNumberSupportingDocumentsAccepted(
    VALID_DOCUMENTS.length + OTHER_VALID_DOCUMENTS.length,
  );
});

Then('none of them is submitted', () => {
  INVALID_DOCUMENTS.forEach((fileName) => {
    confirmSupportingDocumentRejectedBecause(fileName + ' must be a');
  });
  cy.title().should('include', 'Error: ')
  confirmNumberSupportingDocumentsAccepted(0);
});

Then('only valid document are submitted', () => {
  INVALID_DOCUMENTS.forEach((fileName) => {
    confirmSupportingDocumentRejectedBecause(fileName + ' must be a');
  });

  confirmSupportingDocumentAccepted(VALID_DOCUMENTS);

  confirmNumberSupportingDocumentsAccepted(VALID_DOCUMENTS.length);
});
