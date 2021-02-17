class ExtraConditionsPage{
  checkExtraConditionsPageHeading(){
    return cy.get('.govuk-fieldset__heading');
  }

  extraConditionsNotEnteredSummaryErrorMessage() {
    return cy.get('a[href="#extra-conditions-information"]');
  }

  extraConditionsNotEnteredErrorMessage() {
    return cy.get('[data-cy="extra-conditions-information-error"]');
  }

  extraConditionsNoSelectionMadeSummaryErrorMessage() {
    return cy.get('a[href="#extra-conditions"]');
  }

  extraConditionsNoSelectionMadeErrorMessage() {
    return cy.get('[data-cy="extra-conditions-error"]');
  }

  extraConditionsRadioButtonYes() {
    return cy.get('input[data-cy="is-accurate-yes"]');
  }

  extraConditionsRadioButtonNo() {
    return cy.get('input[data-cy="is-accurate-no"]');
  }

  extraConditionsExtraInformationTextBox() {
    return cy.get('input[data-cy="extra-conditions-extra-information"]');
  }
}
export default ExtraConditionsPage;
