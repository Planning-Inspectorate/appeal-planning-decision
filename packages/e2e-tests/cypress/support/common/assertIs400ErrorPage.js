const defaultOptions = {
  expectedTitle: 'GOV.UK - The best place to find government services and information',
  expectedMessage: '',
};

export const assertIs400ErrorPage = ({
  expectedTitle = defaultOptions.expectedTitle,
  expectedMessage = defaultOptions.expectedMessage,
} = defaultOptions) => {
  cy.title().should('eq', expectedTitle);

  cy.get('[data-cy="400-error-message"]')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(expectedMessage);
    });
};
