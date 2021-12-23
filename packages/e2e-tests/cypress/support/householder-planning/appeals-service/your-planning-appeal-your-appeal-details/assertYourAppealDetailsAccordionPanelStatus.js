import { assertRequestedAccordionStateIsValid } from './assertRequestedAccordionStateIsValid';

const STATE = require('./accordionState');

export const assertYourAppealDetailsAccordionPanelStatus = ({ sectionsUnderTest = [], expectedState }) => {
  assertRequestedAccordionStateIsValid(expectedState);

  const isVisible = expectedState === STATE.OPEN ? 'be.visible' : 'not.be.visible';

  const sut = Array.isArray(sectionsUnderTest) ? sectionsUnderTest : [sectionsUnderTest];

  sut.forEach((element) => {
    cy.get(element).should(isVisible);
  });

  //cy.wait(Cypress.env('demoDelay'));
};
