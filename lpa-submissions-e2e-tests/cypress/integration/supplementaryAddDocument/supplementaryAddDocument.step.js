import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {
  adoptedRadioNo,
  adoptedRadioYes,
  fileNameInput,
  stageReachedInput,
  uploadFile,
} from '../../support/PageObjects/SupplementaryAddDocumentsPageObjects';
import fillAdoptedDate from '../../support/supplementary-add-document/fillAdoptedDate';
const page = {
  heading: 'Supplementary planning document',
  section: 'Optional supporting documents',
  title:
    'Supplementary planning documents - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'supplementary-documents',
};
let disableJs = false;

Given('Add supplementary document is requested', () => {
  cy.goToPage(page.url);
});

When('a document has been uploaded', () => {
  uploadFile().attachFile('upload-file-valid.pdf');
});

When('the meta data is completed for {string}', (docType) => {
  const isAdopted = docType === 'an adopted document';

  fileNameInput().type('Mock document name');
  if (isAdopted) {
    adoptedRadioYes().check();
    fillAdoptedDate('12', '06', '2021');
  } else {
    adoptedRadioNo().check();
    stageReachedInput().type('Mock stage');
  }
});

When('no file has been selected', () => {
  uploadFile().should('have.value', '');
  cy.clickSaveAndContinue();
});

When('invalid file {string} has been selected', (doc) => {
  uploadFile().attachFile(doc);
  cy.clickSaveAndContinue();
});

When('file name has been entered', () => {
  fileNameInput().type('Supplementary Document name');
});
When('no file name has been entered', () => {
  fileNameInput().should('have.value', '');
  cy.clickSaveAndContinue();
});

When('formally adopted has not been selected', () => {
  adoptedRadioYes().should('not.be.checked');
  adoptedRadioNo().should('not.be.checked');
  cy.clickSaveAndContinue();
});

When('formally adopted is selected as {string}', (value) => {
  if (value === 'yes') {
    adoptedRadioYes().check();
  } else {
    adoptedRadioNo().check();
  }
});

When('an invalid date of {string}-{string}-{string} is provided', (day, month, year) => {
  fillAdoptedDate(day, month, year);
  cy.clickSaveAndContinue();
});

When('stage reached is not completed', () => {
  stageReachedInput().should('have.value', '');
  cy.clickSaveAndContinue();
});

When('stage reached is completed', () => {
  stageReachedInput().type('Mock stage');
});

Then('the LPA Planning Officer is presented with add supplementary document questions', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.checkPageA11y();
});

Then('progress is made to the supplementary document list', () => {
  cy.verifyPage('supplementary-documents/uploaded-documents');
});

Then('progress is halted with a message {string}', (message) => {
  cy.verifyPage(page.url);

  let errorInput;
  let errorMessage;
  switch (message) {
    case 'the file is missing':
      errorMessage = 'Upload a relevant supplementary planning document';
      errorInput = 'documents';
      break;
    case 'file name is missing':
      errorMessage = 'Enter a name for the supplementary planning document';
      errorInput = 'documentName';
      break;
    case 'formally adopted not complete':
      errorMessage = 'Select whether this supplementary planning document has been adopted';
      errorInput = 'formallyAdopted';
      break;
    case 'stage reached is not complete':
      errorMessage = 'Tell us what stage the supplementary planning document has reached';
      errorInput = 'stageReached';
      break;
    default:
      throw new Error(`Error ${message} not found`);
  }

  cy.validateErrorMessage(errorMessage, `[data-cy="${errorInput}-error"]`, errorInput);
});

Then('progress is halted with a message the file {string} {string}', (fileName, errorType) => {
  let errorMessage = fileName;

  switch (errorType) {
    case 'is too big':
      errorMessage += ' must be smaller than 15 MB';
      break;
    case 'format is incorrect':
      errorMessage += ' is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG';
      break;
  }

  cy.validateErrorMessage(errorMessage, `[data-cy="documents-error"]`, 'documents');
});

Then('progress is halted with an error {string} which highlights {string}', (error, highlights) => {
  const highlightsList = highlights.indexOf(',') ? highlights.split(',') : [highlights];
  // Will link to first highlighted input
  const linkedInput = `adoptedDate-${highlightsList[0]}`;

  cy.validateErrorMessage(error, `[data-cy="adoptedDate-error"]`, linkedInput);

  highlightsList.forEach((input) => {
    cy.get(`#adoptedDate-${input}`).should('have.class', 'govuk-input--error');
  });
});
