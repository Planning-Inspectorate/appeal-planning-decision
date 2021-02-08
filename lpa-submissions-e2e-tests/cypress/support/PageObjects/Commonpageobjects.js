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
}

export default CommonPageObjects;
