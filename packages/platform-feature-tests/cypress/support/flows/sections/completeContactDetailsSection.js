module.exports = () => {
	cy.goToAppealSection('Provide your contact details');

	cy.get('#original-application-your-name').click();
	cy.advanceToNextPage();

	cy.get('#appellant-name').type('Test Test');
	cy.advanceToNextPage();
};
