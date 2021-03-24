class CommonPageObjects {
  questionTitle() {
    return cy.get('h1');
  }

  sectionName() {
    return cy.get('.govuk-caption-l');
  }

  saveAndContinueButton() {
    return cy.get('.govuk-button');
  }

  backButton() {
    return cy.get('[data-cy="back"]');
  }

  clickUploadFileButton() {
    return cy.get('[data-cy="upload-file"]');
  }

  clickChooseFileButton() {
    return cy.get('[data-cy="choose-file"]');
  }

  fileDragAndDrop() {
    return cy.get('[data-cy="file-drop"]');
  }

  fileNotUploadedSummaryErrorMessage() {
    return cy.get('a[href="#not-uploaded"]');
  }

  fileNotUploadedErrorMessage() {
    return cy.get('[data-cy="not-uploaded-error"]');
  }

  fileSizeInvalidSummaryErrorMessage() {
    return cy.get('a[href="#invalid-size"]');
  }

  fileSizeInvalidErrorMessage() {
    return cy.get('[data-cy="invalid-size-error"]');
  }

  fileFormatInvalidSummaryErrorMessage() {
    return cy.get('a[href="#invalid-type"]');
  }

  fileFormatInvalidErrorMessage() {
    return cy.get('[data-cy="invalid-type-error"]');
  }

  fileUploadUnsuccessfulSummaryErrorMessage() {
    return cy.get('a[href="#upload-unsuccessful"]');
  }

  fileUploadUnsuccessfulErrorMessage() {
    return cy.get('[data-cy="upload-unsuccessful-error"]');
  }

  deleteFile() {
    return cy.get('[data-cy="delete-file"]');
  }

  fileUploadSummaryList() {
    return cy.get('.moj-multi-file-upload__filename');
  }
}

export default CommonPageObjects;
