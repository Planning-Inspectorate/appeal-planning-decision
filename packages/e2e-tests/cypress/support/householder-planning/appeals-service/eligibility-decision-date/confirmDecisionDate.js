import { goToAppealsPage } from '../../../common/go-to-page/goToAppealsPage';

export const confirmDecisionDate = ({ day, month, year }) => {
 goToAppealsPage('eligibility/decision-date');

  cy.get('#decision-date-day').should('have.value', day);
  cy.get('#decision-date-month').should('have.value', month);
  cy.get('#decision-date-year').should('have.value', year);
};
