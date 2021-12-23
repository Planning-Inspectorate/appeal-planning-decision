//const assertRequestedAccordionStateIsValid = require('./assertRequestedAccordionStateIsValid');
import { assertRequestedAccordionStateIsValid } from './assertRequestedAccordionStateIsValid';

const STATE = require('./accordionState');
const { accordionOpenCloseAllToggleButton } = require('./selectors');

export const toggleAllYourAppealDetailsAccordionPanels = ({ expectedEndState }) =>
{
  assertRequestedAccordionStateIsValid(expectedEndState);

  cy.get(accordionOpenCloseAllToggleButton).click();
 // cy.wait(Cypress.env('demoDelay'));

  const expectedButtonText = expectedEndState === STATE.CLOSED ? 'Open' : 'Close';

  cy.get(accordionOpenCloseAllToggleButton)
    .invoke('text')
    .then((text) => text.trim())
    .should('eq', `${expectedButtonText} all sections`);
};
