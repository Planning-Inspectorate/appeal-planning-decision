export const getContinueButton = () => cy.get('button[data-cy=button-save-and-continue]');
export const getPageTitle = () => cy.title();
export const getPageHeading = () => cy.findByRole('h1');
export const getErrorMessageSummary =()=> cy.get('.govuk-error-summary');
export const getBackLink = () => cy.get('.govuk-back-link');
