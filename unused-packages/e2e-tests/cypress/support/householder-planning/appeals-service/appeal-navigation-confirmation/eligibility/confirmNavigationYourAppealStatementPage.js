export const confirmNavigationYourAppealStatementPage = () => {
	cy.url().should('include', '/eligibility/appeal-statement');
	//cy.wait(Cypress.env('demoDelay'));
	//Accessibility Testing
	// cy.checkPageA11y({
	//   // known issue: https://github.com/alphagov/govuk-frontend/issues/979
	//   exclude: ['.govuk-radios__input'],
	// });
};
