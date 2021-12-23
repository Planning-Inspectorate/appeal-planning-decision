// confirm that we are in the right place for a successfully-submitted decision date
export const confirmProvidedDecisionDateWasRejected = () => {
  // confirm we are in the right place
  cy.url().should('include', '/eligibility/decision-date');

  cy.get("h1").invoke('text').then((text) => {
    expect(text).to.contain('The deadline for appeal has passed');
  });

}
