exports.questionTitle = () => {
  return cy.get('h1');
};

exports.sectionName = () => {
  return cy.get('.govuk-caption-l');
};

exports.saveAndContinueButton = () => {
  return cy.get('.govuk-button');
};

exports.backButton = () => {
  return cy.get('[data-cy="back"]');
};

exports.pageHeading = () => {
  return cy.get('.govuk-fieldset__heading');
};

exports.textArea = (textBoxId) => {
  return cy.get(`textarea[data-cy="${textBoxId}"]`);
};

exports.input = (inputId) => {
  return cy.get(`input[data-cy="${inputId}"]`);
};

exports.errorMessage = (errorMessageId) => {
  return cy.get(`[data-cy="${errorMessageId}"]`);
};

exports.summaryErrorMessage = (summaryErrorMessageId) => {
  return cy.get(`a[href="#${summaryErrorMessageId}"]`);
};
