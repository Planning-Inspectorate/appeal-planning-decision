class PO_EligibilityDecisionDate {

    navigatetoEligDatePageURL() {
        cy.visit("/eligibility/decision-date")
    }

    validatePageTitle() {
        cy.title().should('eq', 'GOV.UK - The best place to find government services and information')
    }

    validateHeaderLogo() {
        const headerLogo = cy.get('.govuk-header__logotype')
        assert.exists(headerLogo, 'GOV UK Logo exists')
    }

    pageHeaderlink() {
        const headerLink = cy.get('.govuk-header__content > .govuk-header__link')
        assert.exists(headerLink, 'Appeal a householder planning decision exists')
    }

    bannerText() {
        cy.get('.govuk-tag govuk-phase-banner__content__tag'), should('eq', "beta")
        cy.get('.govuk-phase-banner__text').should('eq', "This is a new service – your ")
        cy.get('a[href="feedback"]')
        cy.get('.govuk-link').should('eg', "will help us to improve it.")
    }

    validateText() {
        const captionTextStart = cy.get('.govuk-caption-l')
        assert.exists(captionTextStart, 'Before you start')

        const descisionDateText = cy.get('.govuk-fieldset__heading')
        assert.exists(descisionDateText, "What's is the decision text exists")
        const dateText = cy.get('#decision-date-hint')
        assert.exists(dateText, 'For example hint exists')

        const dayText = cy.get('#decision-date-day')
        assert.exists(dayText, 'Day text field exists')
        const monthText = cy.get('#decision-date-month')
        assert.exists(monthText, 'Month text field exists')
        const yearText = cy.get('#decision-date-year')
        assert.exists(yearText, 'Year text field exists')
    }

    notreceivedDecisionLink() {
        const notReceivedlinkText = cy.get('a[href*="eligibility/no-decision"]')
        assert.exists(notReceivedlinkText, 'I have not received a decision from the local planning dept link exist')
    }

    notreceivedDecisionLinkSelect() {
        const notReceivedLink = cy.get('a[href*="eligibility/no-decision"]').click()
        cy.wait(2000)
    }


    valdiatePageFooter() {
        const footerTxtContact = cy.get(':nth-child(1) > .govuk-footer__heading')
        assert.exists(footerTxtContact, 'Contact the Planning Inspectorate text exists')

        const footerTxtSerInfo = cy.get(':nth-child(2) > .govuk-footer__heading')
        assert.exists(footerTxtSerInfo, 'Service Information text exists')

        const custSupportNumb = cy.get(':nth-child(1) > .govuk-footer__list > :nth-child(1)')
        assert.exists(custSupportNumb, 'Customer Support Telephone number exists')

        const enquiresEmail = cy.get(':nth-child(1) > .govuk-footer__list > :nth-child(2) > .govuk-footer__link')
        assert.exists(enquiresEmail, 'Enquires email exists')

        const termsConditions = cy.get(':nth-child(2) > .govuk-footer__list > :nth-child(1)')
        assert.exists(termsConditions, 'Terms and conditions link exists')

        const privacyLink = cy.get(':nth-child(2) > .govuk-footer__list > :nth-child(2)')
        assert.exists(privacyLink, 'Privacy and cookies link exists')

        const accessibilityLink = cy.get(':nth-child(3) > .govuk-footer__link')
        assert.exists(accessibilityLink, 'Accessibility link exists')

        const footerTxtOGL = cy.get('.govuk-footer__meta-item--grow')
        assert.exists(footerTxtOGL, 'OGL All content is available under the Open Govt v3.0  text exists')

        const footerCrownImage = cy.get('.govuk-footer__meta > :nth-child(2) > .govuk-footer__link')
        assert.exists(footerCrownImage, 'Crown image copyright exists')

    }

    validateError() {
        const dateError = cy.get('.govuk-error-summary')
        assert.exists(dateError, 'Date Error messg exists')

        const dateError2 = cy.get('#decision-date-error')
        expect(dateError2).to.exist
    }


    dateFields(Day, Month, Year) {
        cy.get('#decision-date-day').type(Day)
        Day.type(day)
          cy.debug()
        cy.get('#decision-date-month').type(Month)
        cy.get('#decision-date-year').type(Year)
    }

    continueBtn() {
        const continueBtn = cy.get('.govuk-button').click()
    }

}
export default PO_EligibilityDecisionDate
