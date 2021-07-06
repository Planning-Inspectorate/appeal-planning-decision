import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

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
  cy.goToSupportingDocumentsPage();
});

Given('supporting document {string} being submitted', (fileName) => {
  cy.goToSupportingDocumentsPage();
  cy.uploadSupportingDocuments(fileName);
  cy.clickUploadFiles();
});

Given('multiple documents were previously submitted', () => {
  cy.goToSupportingDocumentsPage();
  cy.uploadSupportingDocuments(OTHER_VALID_DOCUMENTS);
  cy.clickUploadFiles();
});

Given('multiple valid and invalid documents were previously uploaded', () => {
  cy.goToSupportingDocumentsPage();
  cy.uploadSupportingDocuments(INVALID_DOCUMENTS.concat(OTHER_VALID_DOCUMENTS));
  cy.clickUploadFiles();
});

When('no document is uploaded', () => {
  cy.clickSaveAndContinue();
});

When('a valid document {string} is uploaded', (validFileName) => {
  cy.uploadSupportingDocuments(validFileName);
  cy.clickSaveAndContinue();
});

When('an invalid document {string} is uploaded', (invalidFileName) => {
  cy.uploadSupportingDocuments(invalidFileName);
  cy.clickSaveAndContinue();
});

When('multiple valid documents are uploaded simultaneously', () => {
  cy.uploadSupportingDocuments(VALID_DOCUMENTS);
  cy.clickSaveAndContinue();
});

When('multiple invalid documents are uploaded simultaneously', () => {
  cy.uploadSupportingDocuments(INVALID_DOCUMENTS);
  cy.clickSaveAndContinue();
});

When('mix of valid and invalid documents are uploaded simultaneously', () => {
  cy.uploadSupportingDocuments(VALID_DOCUMENTS.concat(INVALID_DOCUMENTS));
  cy.clickSaveAndContinue();
});

Then('no document are submitted', () => {
  cy.confirmNumberSupportingDocumentsAccepted(0);
});

Then('document {string} is submitted', (fileName) => {
  cy.confirmSupportingDocumentAccepted(fileName);
});

Then('both document {string} and {string} are submitted', (fileName1, fileName2) => {
  cy.confirmNumberSupportingDocumentsAccepted(2);
  cy.confirmSupportingDocumentAccepted(fileName1);
  cy.confirmSupportingDocumentAccepted(fileName2);
});

Then('document {string} is not submitted because {string}', (fileName, reason) => {
  switch (reason) {
    case 'file type is invalid':
      cy.confirmSupportingDocumentRejectedBecause(fileName + ' must be a');
      break;
    case 'file size exceeds limit':
      cy.confirmSupportingDocumentRejectedBecause(fileName + ' must be smaller than');
      break;
  }
  cy.title().should('include', 'Error: ')
});

Then('all the documents are submitted', () => {
  cy.confirmSupportingDocumentAccepted(VALID_DOCUMENTS);
  cy.confirmNumberSupportingDocumentsAccepted(VALID_DOCUMENTS.length);
});

Then('the documents are added to the previous ones', () => {
  cy.confirmSupportingDocumentAccepted(VALID_DOCUMENTS.concat(OTHER_VALID_DOCUMENTS));

  cy.confirmNumberSupportingDocumentsAccepted(
    VALID_DOCUMENTS.length + OTHER_VALID_DOCUMENTS.length,
  );
});

Then('none of them is submitted', () => {
  INVALID_DOCUMENTS.forEach((fileName) => {
    cy.confirmSupportingDocumentRejectedBecause(fileName + ' must be a');
  });
  cy.title().should('include', 'Error: ')
  cy.confirmNumberSupportingDocumentsAccepted(0);
});

Then('only valid document are submitted', () => {
  INVALID_DOCUMENTS.forEach((fileName) => {
    cy.confirmSupportingDocumentRejectedBecause(fileName + ' must be a');
  });

  cy.confirmSupportingDocumentAccepted(VALID_DOCUMENTS);

  cy.confirmNumberSupportingDocumentsAccepted(VALID_DOCUMENTS.length);
});
