export const confirmFileUploadIsRequested = () => {
	cy.get('.govuk-error-summary__list')
		.invoke('text')
		.then((text) => {
			expect(text).to.contain('Select an appeal statement');
		});
	// cy.wait(Cypress.env('demoDelay'));
	// //Accessibility Testing
	// cy.checkPageA11y({
	//   // known issue: https://github.com/alphagov/govuk-frontend/issues/979
	//   exclude: ['.govuk-radios__input'],
	// });
};