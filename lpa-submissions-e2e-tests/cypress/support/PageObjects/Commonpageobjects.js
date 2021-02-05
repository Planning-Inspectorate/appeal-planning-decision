class CommonPageObjects{
  validatePageCaption(){
    return cy.get('.govuk-caption-l')
  }

  validatePageLegendText(){
    return cy.get('.govuk-fieldset__legend--l');
  }

  saveAndContinueButton(){
    return cy.get('.govuk-button');
  }

  errorMessage(){
    return cy.get('.govukErrorSummary');
  }
}

export default CommonPageObjects;
