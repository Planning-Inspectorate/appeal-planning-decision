class PO_EligibilityNoDecision {
	serviceText() {
		const heading =
			'This service is only for householder planning applications that have received a decision';
		cy.get('.govuk-heading-l');
		cy.title().should('contain', heading);
		cy.get('.govuk-body');
	}

	appealPlanningDecLink() {
		cy.get('.govuk-body > a');
	}

	appealsCaseWorkPageURL() {
		cy.get('.govuk-body > a');
	}

	appealsCaseworkPortalPage() {
		cy.visit('https://acp.planninginspectorate.gov.uk/');
		// cy.pause()
	}

	appealsCaseworkPortalPageLogiIn() {
		cy.get('#cphMainContent_LoginUser_LoginLegend');
	}
}

export default PO_EligibilityNoDecision;
