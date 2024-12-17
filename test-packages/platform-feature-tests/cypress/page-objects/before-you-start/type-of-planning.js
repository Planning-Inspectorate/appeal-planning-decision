// @ts-nocheck
/// <reference types="cypress"/>
export class TypeOfPlanning {
	elements = {
		fullPlanningRadioBtn: () => cy.get('[data-cy="answer-full-appeal"]'),
		houseHolderPlanningRadioBtn: () => cy.get('[data-cy="answer-householder-planning"]')
	}

	selectFullPlanning() {
		this.elements.fullPlanningRadioBtn().click();
	}

	selectHouseHolderPlanning() {
		this.elements.houseHolderPlanningRadioBtn().click();
	}
}
