import {
  getDateDecisionDueDay,
  getDateDecisionDueMonth,
  getDateDecisionDueYear
} from '../page-objects/date-decision-due-po';

export const enterDateDecisionDue = (option, elementValue) => {
  switch (option){
    case 'day':
      getDateDecisionDueDay().clear().type(elementValue);
      break;
    case 'month':
      getDateDecisionDueMonth().clear().type(elementValue);
      break;
    case 'year':
      getDateDecisionDueYear().clear().type(elementValue);
      break;
  }
}

export const verifyHighlights = (highlights) => {
  const highlightsList = highlights.split(',') || [highlights];

  highlightsList.forEach(input => {
    cy.get(`#decision-date-${input}`).should('have.class','govuk-input--error');
  });

  cy.wait(Cypress.env('demoDelay'))
}
