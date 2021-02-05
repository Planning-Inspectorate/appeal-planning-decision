class AppealsInImmediateArea{
  validateAppealsPageCaption(){
    return cy.get('.govuk-caption-l').invoke('text')
    .then(text =>{
      expect(text).to.eq('About the appeal');
    })

  }

  appealReferenceNumberTextBox(){
    return cy.get('[data-cy="appeal-reference-numbers"]');
  }

  appealReferenceNumberLabelText(){
    return cy.get('label[data-cy="appeal-reference-number-label"]');

  }

  appealReferenceNumberLabelHint(){
    return cy.get('div[data-cy="appeal-reference-numbers-hint"]');
  }

  areaAppealsRadioButtonYes(){
    return cy.get('radio[data-cy="adjacent-appeals-yes"]');
  }

  areaAppealsRadioButtonYes(){
    return cy.get('radio[data-cy="adjacent-appeals-no"]');
  }

  areaAppealsAppealNumbersNotEnteredSummaryErrorMessage(){
    return cy.get('a[href="#appeal-reference-numbers"]');
  }
  areaAppealsNoSelectionMadeSummaryErrorMessage(){
    return cy.get('a[href="#adjacent-appeals"]');
  }
  areaAppealsNoSelectionMadeErrorMessage(){
    return cy.get('data-cy="adjacent-appeals-error"');
  }

  areaAppealsAppealNumbersNotEnteredErrorMessage(){
    return cy.get('data-cy="appeal-reference-numbers-error"');
  }
}

export default AppealsInImmediateArea;
