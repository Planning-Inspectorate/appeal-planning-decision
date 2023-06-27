export class ApplicationNumber {
	elements = {
		appNumber: () => cy.get('[data-cy="application-number"]')
	};

	enterAppNumber(appNumber) {
		this.elements.appNumber().clear().type(appNumber);
	}
}
