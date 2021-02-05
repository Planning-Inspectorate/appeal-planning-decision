class AppealsInImmediateArea{
  validateAppealsPageCaption(){
    return cy.get('.govuk-caption-l').invoke('text')
    .then(text =>{
      expect(text).to.eq('About the appeal');
    })

  }

  appealReferenceNumberTextBox(){
    return cy.get('#appeal-reference-numbers');
  }

  appealReferenceNumberLabelText(){
    return cy.get('label[#site-access-conditional-hint]');

  }

  appealReferenceNumberLabelHint(){
    return cy.get('div[#event-name-hint]');
  }

  areaAppealsRadioButtonYes(){
    return cy.get('radio[data-cy=areaAppeals-Yes]');
  }
  areaAppealsRadioButtonNo(){
    return cy.get('radio[data-cy=areaAppeals-No]');
  }
}

export default AppealsInImmediateArea;
