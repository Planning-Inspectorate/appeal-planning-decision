class ExtraConditionsPage{
  checkExtraConditionsPageHeading(){
    return cy.get('.govuk-fieldset__heading');
  }

  extraConditionsNotEnteredSummaryErrorMessage() {
    return cy.get('a[href="#extra-conditions-text"]');
  }

  extraConditionsNotEnteredErrorMessage() {
    return cy.get('[data-cy="extra-conditions-text-error"]');
  }

  extraConditionsNoSelectionMadeSummaryErrorMessage() {
    return cy.get('a[href="#has-extra-conditions"]');
  }

  extraConditionsNoSelectionMadeErrorMessage() {
    return cy.get('[data-cy="extra-conditions-error"]');
  }

  extraConditionsRadioButtonYes() {
    return cy.get('input[data-cy="has-extra-conditions-yes"]');
  }

  extraConditionsRadioButtonNo() {
    return cy.get('input[data-cy="has-extra-conditions-no"]');
  }

  extraConditionsExtraInformationTextBox() {
    return cy.get('textarea[data-cy="extra-conditions-text"]');
  }
}
export default ExtraConditionsPage;
