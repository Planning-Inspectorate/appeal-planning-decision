export class TaskList {
	elements = {
		//applicationNameSection: () => cy.get(),
		contactDetailsLink: () => cy.get('[data-cy="contactDetailsSection"]'), // Provide your contact details
		appealSiteSectionLink: () => cy.get('[data-cy="appealSiteSection"]'), // Tell us about the appeal site
		appealDecisionSectionLink: () => cy.get('[data-cy="appealDecisionSection"]'), // Tell us how you would prefer us to decide your appeal
		planningApplicationDocumentsSectionLink: () =>
			cy.get('[data-cy="planningApplicationDocumentsSection"]'), // Upload documents from your planning application
		appealDocumentsSectionDataLink: () => cy.get('[data-cy="appealDocumentsSection"]') // Upload documents for your appeal
	};

	clickContactDetailsLink() {
		this.elements.contactDetailsLink().click();
	}

	clickAppealSiteSectionLink() {
		this.elements.appealSiteSectionLink().click();
	}

	clickAppealDecisionSectionLink() {
		this.elements.appealDecisionSectionLink().click();
	}

	clickPlanningApplicationDocumentsSectionLink() {
		this.elements.planningApplicationDocumentsSectionLink().click();
	}

	clickAppealDocumentsSectionDataLink() {
		this.elements.appealDocumentsSectionDataLink().click();
	}
}
