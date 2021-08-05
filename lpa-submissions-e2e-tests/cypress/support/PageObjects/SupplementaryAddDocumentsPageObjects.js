export const fileNameInput = () => {
  return cy.get('input#documentName');
};
export const stageReachedInput = () => {
  return cy.get(`input#stageReached`);
};
export const adoptedRadioYes = () => {
  return cy.get('[data-cy=formallyAdopted-yes]');
};

export const adoptedRadioNo = () => {
  return cy.get('[data-cy=formallyAdopted-no]');
};

export const uploadFile = () => {
  return cy.get(`input#documents`);
};

export const dayInput = () => {
  return cy.get(`input[id=adoptedDate-day]`);
};

export const monthInput = () => {
  return cy.get(`input[id=adoptedDate-month]`);
};

export const yearInput = () => {
  return cy.get(`input[id=adoptedDate-year]`);
};

export const addAnother = () => {
  return cy.get('[data-cy=add-another]');
};

export const continueButton = () => {
  return cy.get('[data-cy=continue]');
};

export const supplementaryDocumentList = () => {
  return cy.get('th[class="govuk-table__header"]');
};

export const getDeleteLink = () => {
  return cy.get('a[href="delete-document?row=0"]');
};

export const getDocumentName = () => {
  return cy.get('th[class="govuk-table__header"]');
};

export const confirmationMessage = () => {
  return cy.get('div[class=govuk-checkboxes__item]');
};

export const getCheckbox = () => {
  return cy.get('input[id=areyousure]');
};

export const getDeleteButton = () => {
  return cy.findByRole('button', { name: 'Delete' });
};

export const getCancelButton = () => {
  return cy.findByRole('button', { name: 'Cancel' });
};
