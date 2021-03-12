class DevelopmentPlanPage {
  checkDevelopmentPlanPageHeading() {
    return cy.get('.govuk-fieldset__heading');
  }

  relevantInformationNotEnteredSummaryErrorMessage() {
    return cy.get('a[href="#plan-changes-text"]');
  }

  relevantInformationNotEnteredErrorMessage() {
    return cy.get('[data-cy="plan-changes-text-error"]');
  }

  developmentPlanNoSelectionMadeSummaryErrorMessage() {
    return cy.get('a[href="#has-plan-submitted"]');
  }

  developmentPlanNoSelectionMadeErrorMessage() {
    return cy.get('[data-cy="has-plan-submitted-error"]');
  }

  developmentPlanRadioButtonYes() {
    return cy.get('input[data-cy="has-plan-submitted-yes"]');
  }

  developmentPlanRadioButtonNo() {
    return cy.get('input[data-cy="has-plan-submitted-no"]');
  }

  developmentPlanDetailsTextBox() {
    return cy.get('textarea[data-cy="plan-changes-text"]');
  }
}
export default DevelopmentPlanPage;
