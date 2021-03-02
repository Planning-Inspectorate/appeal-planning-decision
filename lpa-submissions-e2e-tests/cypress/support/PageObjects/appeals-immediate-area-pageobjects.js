class AppealsInImmediateArea {
  appealReferenceNumberTextBox() {
    return cy.get('[data-cy="appeal-reference-numbers"]');
  }

  appealReferenceNumberLabelText() {
    return cy.get('label[data-cy="appeal-reference-numbers-label"]');
  }

  appealReferenceNumberLabelHint() {
    return cy.get('div[data-cy="appeal-reference-numbers-hint"]');
  }

  otherAppealsRadioButtonYes() {
    return cy.get('input[data-cy="adjacent-appeals-yes"]');
  }

  otherAppealsRadioButtonNo() {
    return cy.get('input[data-cy="adjacent-appeals-no"]');
  }

  otherAppealsAppealNumbersNotEnteredSummaryErrorMessage() {
    return cy.get('a[href="#appeal-reference-numbers"]');
  }

  otherAppealsNoSelectionMadeSummaryErrorMessage() {
    return cy.get('a[href="#adjacent-appeals"]');
  }
  
  otherAppealsNoSelectionMadeErrorMessage() {
    return cy.get('[data-cy="adjacent-appeals-error"]');
  }

  otherAppealsAppealNumbersNotEnteredErrorMessage() {
    return cy.get('[data-cy="appeal-reference-numbers-error"]');
  }
}

export default AppealsInImmediateArea;
