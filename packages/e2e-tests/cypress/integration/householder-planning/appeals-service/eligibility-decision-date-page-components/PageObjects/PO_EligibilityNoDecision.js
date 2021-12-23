class PO_EligibilityNoDecision {
  serviceText() {
    cy.wait(2000);
    const heading =
      'This service is only for householder planning applications that have received a decision';
    const serviceTxt = cy.get('.govuk-heading-l');
    cy.title().should('contain', heading);
    assert.exists(serviceTxt, heading);
    const contentTxt = cy.get('.govuk-body');
    assert.exists(contentTxt, 'If you applied for householder planning permission content exists');
  }

  appealPlanningDecLink() {
    const appealPlanningDecLnk = cy.get('.govuk-body > a');
    assert.exists(appealPlanningDecLnk, 'https://acp.planninginspectorate.gov.uk/ is the link');
    cy.wait(2000);
  }

  appealsCaseWorkPageURL() {
    const caseWorkPageURL = cy.get('.govuk-body > a');
    assert.exists(caseWorkPageURL, 'the URL points to the correct site');
  }
  appealsCaseworkPortalPage() {
    cy.visit('https://acp.planninginspectorate.gov.uk/');
    // cy.pause()
  }
  appealsCaseworkPortalPageLogiIn() {
    const logInRegTxt = cy.get('#cphMainContent_LoginUser_LoginLegend');
    cy.wait(2000);
    assert.exists(logInRegTxt, 'Log in or Register page displayed');
  }
}

export default PO_EligibilityNoDecision;
