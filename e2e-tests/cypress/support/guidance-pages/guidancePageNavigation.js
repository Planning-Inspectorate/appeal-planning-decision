module.exports = (navigationType) => {
  let identifier;
  switch (navigationType) {
    case 'next':
      identifier = '[data-cy="pagination-next"]';
      break;
    case 'previous':
      identifier = '[data-cy="pagination-previous"]';
      break;
    case 'start':
      identifier = '[data-cy="guidance-form-start"]';
      break;
  }

  cy.get(identifier).first().click();

  cy.wait(Cypress.env('demoDelay'));
};
