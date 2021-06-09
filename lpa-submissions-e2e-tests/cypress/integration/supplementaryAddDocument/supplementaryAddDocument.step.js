import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const page = {
  heading: 'Supplementary planning document',
  section: 'Optional supporting documents',
  title:
    'Add Supplementary planning document - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  url: 'supplementary-documents/add-document',
};

const FILE_INPUT = 'documents';
const FILE_NAME_INPUT = 'documentName';
const ADOPTED_INPUT = 'formallyAdopted';
const DATE_INPUT = 'adoptedDate';
const STAGE_INPUT = 'stageReached';

const fileNameInput = () => cy.get(`input#${FILE_NAME_INPUT}`);
const stageReachedInput = () => cy.get(`input#${STAGE_INPUT}`);
const adoptedRadio = (value) => cy.get(`[data-cy="${ADOPTED_INPUT}-${value ? 'yes' : 'no'}"]`);

const uploadFile = (fileName) => {
  cy.get(`input#${FILE_INPUT}`).attachFile(fileName);
};

const fillAdoptedDate = (day, month, year) => {
  if (day) cy.get(`input#${DATE_INPUT}-day`).type(day);
  if (month) cy.get(`input#${DATE_INPUT}-month`).type(month);
  if (year) cy.get(`input#${DATE_INPUT}-year`).type(year);
};

Given('Add supplementary document is requested', () => {
  cy.goToPage(page.url);
});

When('a document has been uploaded', () => {
  uploadFile('upload-file-valid.pdf');
});

When('the meta data is completed for {string}', (docType) => {
  const isAdopted = docType === 'an adopted document';

  fileNameInput().type('Mock document name');
  adoptedRadio(isAdopted).check();

  if (isAdopted) {
    fillAdoptedDate('12', '06', '2021');
  } else {
    stageReachedInput().type('Mock stage');
  }
});

When('no file has been selected', () => {
  cy.get('input#documents').should('have.value', '');
  cy.clickSaveAndContinue();
});

When('invalid file {string} has been selected', (doc) => {
  uploadFile(doc);
  cy.clickSaveAndContinue();
});

When('no file name has been entered', () => {
  fileNameInput().should('have.value', '');
  cy.clickSaveAndContinue();
});

When('formally adopted has not been selected', () => {
  adoptedRadio(true).should('not.be.checked');
  adoptedRadio(false).should('not.be.checked');
  cy.clickSaveAndContinue();
});

When('formally adopted is selected as {string}', (value) => {
  adoptedRadio(value === 'yes').check();
});

When('an invalid date of {string}-{string}-{string} is provided', (day, month, year) => {
  fillAdoptedDate(day, month, year);
  cy.clickSaveAndContinue();
});

When('stage reached is not completed', () => {
  stageReachedInput().should('have.value', '');
  cy.clickSaveAndContinue();
});

Then('the LPA Planning Officer is presented with add supplementary document questions', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.checkPageA11y();
});

Then('progress is made to the supplementary document list', () => {
  cy.verifyPage('supplementary-documents');
});

Then('progress is halted with a message {string}', (message) => {
  cy.verifyPage(page.url);

  let errorInput;
  let errorMessage;
  switch (message) {
    case 'the file is missing':
      errorMessage = 'Upload a relevant supplementary planning document';
      errorInput = FILE_INPUT;
      break;
    case 'file name is missing':
      errorMessage = 'Enter a name for the supplementary planning document';
      errorInput = FILE_NAME_INPUT;
      break;
    case 'formally adopted not complete':
      errorMessage = 'Select whether this supplementary planning document has been adopted';
      errorInput = ADOPTED_INPUT;
      break;
    case 'stage reached is not complete':
      errorMessage = 'Tell us what stage the supplementary planning document has reached';
      errorInput = STAGE_INPUT;
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

  cy.validateErrorMessage(errorMessage, `[data-cy="${FILE_INPUT}-error"]`, FILE_INPUT);
});

Then('progress is halted with an error {string} which highlights {string}', (error, highlights) => {
  const highlightsList = highlights.indexOf(',') ? highlights.split(',') : [highlights];
  // Will link to first highlighted input
  const linkedInput = `${DATE_INPUT}-${highlightsList[0]}`;

  cy.validateErrorMessage(error, `[data-cy="${DATE_INPUT}-error"]`, linkedInput);

  highlightsList.forEach((input) => {
    cy.get(`#${DATE_INPUT}-${input}`).should('have.class', 'govuk-input--error');
  });
});
