// @ts-nocheck
/// <reference types="cypress"/>
export class TypeOfPlanning {
	elements = {
		fullPlanningRadioBtn: () => cy.get('[data-cy="answer-full-appeal"]'),
		houseHolderPlanningRadioBtn: () => cy.get('[data-cy="answer-householder-planning"]'),
		minorCommercialDevelopmentRadioBtn: ()=>cy.get('[data-cy="answer-minor-commercial-development"]'),
	}

	selectFullPlanning() {
		this.elements.fullPlanningRadioBtn().click();
	}

	selectHouseHolderPlanning() {
		this.elements.houseHolderPlanningRadioBtn().click();
	}

	selectcasPlanning() {
		this.elements.minorCommercialDevelopmentRadioBtn().click();
	}
}
