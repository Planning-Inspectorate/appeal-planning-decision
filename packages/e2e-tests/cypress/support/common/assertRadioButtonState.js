export const assertRadioButtonState = (cyTags, { isChecked }) => {
  const matchAssertion = isChecked ? 'be.checked' : 'not.be.checked';

  const interestingTags = Array.isArray(cyTags) ? cyTags : [cyTags];

  interestingTags.forEach((tag) => {
    cy.get(`[data-cy="${tag}"]`).should(matchAssertion);
    cy.wait(Cypress.env('demoDelay'));
  });
};
