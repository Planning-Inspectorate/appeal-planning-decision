// confirm that we are in the right place for a successfully-submitted decision date
export const confirmProvidedDecisionDateWasAccepted = () => {
  // confirm we are in the right place
  cy.url().should('include', '/eligibility/planning-department');
}
