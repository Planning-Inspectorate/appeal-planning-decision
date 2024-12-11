// @ts-nocheck
/// <reference types="cypress"/>
export class EmailAddressInput {
	elements = {
		emailAddressField: () => cy.get('[data-cy="email-address"]')
	}

	enterEmailAddress(emailAddress) {
		this.elements.emailAddressField().clear().type(emailAddress);
	}
}
