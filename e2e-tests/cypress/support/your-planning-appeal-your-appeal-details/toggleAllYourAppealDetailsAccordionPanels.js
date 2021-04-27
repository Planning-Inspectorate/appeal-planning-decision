const assertRequestedAccordionStateIsValid = require('./assertRequestedAccordionStateIsValid');
const STATE = require('./accordion-states');
const { accordionOpenCloseAllToggleButton } = require('./selectors');

module.exports = ({ expectedEndState }) => {
  assertRequestedAccordionStateIsValid(expectedEndState);

  cy.get(accordionOpenCloseAllToggleButton).click();
  cy.wait(Cypress.env('demoDelay'));

  const expectedButtonText = expectedEndState === STATE.CLOSED ? 'Open' : 'Close';

  cy.get(accordionOpenCloseAllToggleButton)
    .invoke('text')
    .then((text) => text.trim())
    .should('eq', `${expectedButtonText} all sections`);
};
