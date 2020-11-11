class PO_EligibilityNoDecision {

    navigateToNoDecisionPage() {
        const eligDateURL = cy.visit("/eligibility/no-decision")
    }

    serviceText() {
        cy.wait(2000)
        const serviceTxt = cy.get('.govuk-heading-l')
        assert.exists(serviceTxt, 'This service is only for householder content exists')
        const contentTxt = cy.get('.govuk-body')
        assert.exists(contentTxt, 'If you applied for householder planning permission content exists')
    }

    appealPlanningDecLink() {
        const appealPlanningDecLnk = cy.get('.govuk-body > a')
        assert.exists(appealPlanningDecLnk, 'https://acp.planninginspectorate.gov.uk/ is the link')
        cy.wait(2000)
    }

    appealsCaseWorkPageURL() {
        const caseWorkPageURL = cy.get('.govuk-body > a')
        assert.exists(caseWorkPageURL, 'the URL points to the correct site')
    }
    appealsCaseworkPortalPage() {
        cy.visit("https://acp.planninginspectorate.gov.uk/")
    }
    appealsCaseworkPortalPageLogiIn() {
        const logInRegTxt = cy.get('#cphMainContent_LoginUser_LoginLegend')
        cy.wait(2000)
        assert.exists(logInRegTxt, 'Log in or Register page displayed')
    }
}

export default PO_EligibilityNoDecision
