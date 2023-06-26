import { BasePage } from '../../page-objects/base-page';

export class TypeOfPlanning extends BasePage {
	elements = {
		fullPlanningRadioBtn: () => cy.get('[data-cy="answer-householder-planning"]'),
		houseHolderPlanningRadioBtn: () => cy.get('[data-cy="answer-full-appeal"]')
	};

	selectFullPlanning() {
		this.elements.fullPlanningRadioBtn().click();
	}

	selectHouseHolderPlanning() {
		this.elements.houseHolderPlanningRadioBtn().click();
	}
}
