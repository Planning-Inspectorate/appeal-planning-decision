export const provideAcceptNotNecessaryCookies = () => {
	cy.get('[data-cy="cookie-banner-accept-analytics-cookies"]').click();
	//cy.wait(Cypress.env('demoDelay'));
};