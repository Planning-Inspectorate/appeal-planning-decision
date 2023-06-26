export const confirmNavigationNoDecisionDatePage = () => {
	cy.url().should('include', '/eligibility/no-decision');
	cy.get('.govuk-heading-l');
	cy.get('.govuk-body');
	cy.get('[data-cy="appeal-decision-service"]')
		.invoke('attr', 'href')
		.then((href) => {
			expect(href).to.contain('https://acp.planninginspectorate.gov.uk/');
		});
	// cy.wait(Cypress.env('demoDelay'));
};
