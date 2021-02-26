// implementation of the users desire to provide a decision date..
module.exports = ({ day, month, year }) => {
  // go to the right page
  cy.visit('/eligibility/decision-date');

  // provide the date
  cy.get('#decision-date-day').type(`{selectall}{backspace}${day}`);
  cy.get('#decision-date-month').type(`{selectall}{backspace}${month}`);
  cy.get('#decision-date-year').type(`{selectall}{backspace}${year}`);

  // click the submit button, leaving enough time for us to capture nice videos..
  cy.wait(Cypress.env('demoDelay'));
  cy.clickSaveAndContinue();
  cy.wait(Cypress.env('demoDelay'));
};
