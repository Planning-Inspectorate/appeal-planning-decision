// @ts-nocheck
/// <reference types="cypress"/>
export class EnterLpa {
	elements = {
		lpaInput: () => cy.get('#local-planning-department'),
		lpaOption: () => cy.get('#local-planning-department__option--0')
	}

	enterLPA(lpaName) {
		this.elements.lpaInput().type(lpaName);
	}

	selectLPA() {
		this.elements.lpaOption().click();
	}
}
