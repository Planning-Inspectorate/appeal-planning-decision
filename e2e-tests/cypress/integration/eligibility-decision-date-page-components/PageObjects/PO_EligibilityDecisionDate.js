class PO_EligibilityDecisionDate {
  navigatetoEligDatePageURL() {
    cy.visit('/eligibility/decision-date');
  }

  validatePageTitle() {
    cy.title().should('eq', "What's the decision date on the letter from the local planning department? - Eligibility - Appeal a householder planning decision - GOV.UK");
  }

  validateHeaderLogo() {
    const headerLogo = cy.get('.govuk-header__logotype');
    assert.exists(headerLogo, 'GOV UK Logo exists');
  }

  pageHeaderlink() {
    //const headerLink = cy.get('a[href="Appeal a householder planning decision"]')
    const headerLink = cy.get('.govuk-header__content > .govuk-header__link')
    assert.exists(headerLink, 'Appeal a householder planning decision exists')
    headerLink.should('have.attr', 'href').and('eq', '/');
  }

  bannerText() {
    cy.get('.govuk-tag govuk-phase-banner__content__tag'), should('eq', 'beta');
    cy.get('.govuk-phase-banner__text').should('eq', 'This is a new service – your ');
    cy.get('a[href="feedback"]');
    cy.get('.govuk-link').should('eg', 'will help us to improve it.');
  }

  validateText() {
    const captionTextStart = cy.get('.govuk-caption-l');
    // assert.equal(captionTextStart, 'Before you start', 'actual and expected text match')
    assert.exists(captionTextStart, 'Before you start');
    //const captionText = cy.get('.govuk-fieldset__heading')

    const descisionDateText = cy.get('.govuk-fieldset__heading');
    assert.exists(descisionDateText, "What's is the decision text exists");
    // .should('eq', "What's the decision date on the letter from the local planning department?​")
    const dateText = cy.get('#decision-date-hint');
    assert.exists(dateText, 'For example hint exists');

    const dayText = cy.get('#decision-date-day');
    assert.exists(dayText, 'Day text field exists');
    const monthText = cy.get('#decision-date-month');
    assert.exists(monthText, 'Month text field exists');
    const yearText = cy.get('#decision-date-year');
    assert.exists(yearText, 'Year text field exists');
  }

  valdiatePageFooter() {
    const footerTxtContact = cy.get(':nth-child(1) > .govuk-footer__heading');
    assert.exists(footerTxtContact, 'Contact the Planning Inspectorate text exists');

    const footerTxtSerInfo = cy.get(':nth-child(2) > .govuk-footer__heading');
    assert.exists(footerTxtSerInfo, 'Service Information text exists');

    const custSupportNumb = cy.get(':nth-child(1) > .govuk-footer__list > :nth-child(1)');
    assert.exists(custSupportNumb, 'Customer Support Telephone number exists');

    const enquiresEmail = cy.get(
      ':nth-child(1) > .govuk-footer__list > :nth-child(2) > .govuk-footer__link',
    );
    assert.exists(enquiresEmail, 'Enquires email exists');

    const termsConditions = cy.get(':nth-child(2) > .govuk-footer__list > :nth-child(1)');
    assert.exists(termsConditions, 'Terms and conditions link exists');

    const privacyLink = cy.get(':nth-child(2) > .govuk-footer__list > :nth-child(2)');
    assert.exists(privacyLink, 'Privacy and cookies link exists');

    const accessibilityLink = cy.get(':nth-child(3) > .govuk-footer__link');
    assert.exists(accessibilityLink, 'Accessibility link exists');

    const footerTxtOGL = cy.get('.govuk-footer__meta-item--grow');
    assert.exists(
      footerTxtOGL,
      'OGL All content is available under the Open Govt v3.0  text exists',
    );

    const footerCrownImage = cy.get('.govuk-footer__meta > :nth-child(2) > .govuk-footer__link');
    assert.exists(footerCrownImage, 'Crown image copyright exists');
  }

  validateError() {
    const dateError = cy.get('.govuk-error-summary');
    assert.exists(dateError, 'Date Error messg exists');

    const dateError2 = cy.get('#decision-date-error');
    expect(dateError2).to.exist;
  }

  dateFields(Day, Month, Year) {
    if (Day) {
      cy.get('#decision-date-day').type(Day);
    }
    if (Month) {
      cy.get('#decision-date-month').type(Month);
    }
    if (Year) {
      cy.get('#decision-date-year').type(Year);
    }
  }

  dateFieldsempty(Day, Month, Year) {
    cy.get('#decision-date-day').type(Day);
    cy.get('#decision-date-month').type(Month);
    cy.get('#decision-date-year').type(Year);
  }

  continueBtn() {
    cy.wait(Cypress.env('demoDelay'));
    cy.clickSaveAndContinue();
    cy.wait(Cypress.env('demoDelay'));
  }

  //No decision date PO's

  navigateToNoDecisionPage() {
    const eligDateURL = cy.visit('/eligibility/no-decision');
  }

  serviceText() {
    cy.wait(2000);
    const serviceTxt = cy.get('.govuk-heading-l');
    assert.exists(serviceTxt, 'This service is only for householder content exists');
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

  navigateToLocalPlanDept() {
    const localplandept = cy.visit(
      'https://appeals-dev.planninginspectorate.gov.uk/eligibility/planning-department',
    );
  }
  localPlanDeptText() {
    const plandept = cy.get('.govuk-label');
    assert.exists(plandept, 'What is the name of the local planning department');
  }

  deadlinePassedPageText() {
    const deadlinePassedText = cy.get('.govuk-heading-l');
  }
}
export default PO_EligibilityDecisionDate;
