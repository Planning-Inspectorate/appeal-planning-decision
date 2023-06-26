import { BasePage } from '../../page-objects/base-page';

export class BeforeYouStart extends BasePage {
	elements = {
		lpaInput: () => cy.get('#local-planning-department'),
		lpaOption: () => cy.get('#local-planning-department__option--0')
	};

	enterLPA(lpaName) {
		this.elements.lpaInput().type(lpaName);
	}

	selectLPA() {
		this.elements.lpaOption().click();
	}
}
