class DevelopmentPlanPage{
  checkDevelopmentPlanPageHeading(){
    return cy.get('.govuk-fieldset__heading');
  }

  relevantInformationNotEnteredSummaryErrorMessage() {
    return cy.get('a[href="#development-plan-text"]');
  }

  relevantInformationNotEnteredErrorMessage() {
    return cy.get('[data-cy="development-plan-text-error"]');
  }

  developmentPlanNoSelectionMadeSummaryErrorMessage() {
    return cy.get('a[href="#has-development-plan"]');
  }

  developmentPlanNoSelectionMadeErrorMessage() {
    return cy.get('[data-cy="development-plan-error"]');
  }

  developmentPlanRadioButtonYes() {
    return cy.get('input[data-cy="has-development-plan-yes"]');
  }

  developmentPlanRadioButtonNo() {
    return cy.get('input[data-cy="has-development-plan-no"]');
  }

  developmentPlanDetailsTextBox() {
    return cy.get('textarea[data-cy="development-plan-text"]');
  }
}
export default DevelopmentPlanPage;
