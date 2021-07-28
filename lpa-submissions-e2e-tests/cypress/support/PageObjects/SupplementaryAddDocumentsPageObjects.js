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
