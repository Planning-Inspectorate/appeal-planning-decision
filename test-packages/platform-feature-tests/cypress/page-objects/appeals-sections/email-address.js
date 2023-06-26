import { BasePage } from '../base-page';

export class EmailAddressInput extends BasePage {
	elements = {
		EmailAddressField: () => cy.get('[data-cy="email-address"]')
	};

	enterEmailAddress(emailAddress) {
		this.elements.EmailAddressField().type(emailAddress);
	}
}
