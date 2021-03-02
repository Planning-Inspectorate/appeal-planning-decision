class SubmissionAccuracy {
  inaccuracyReasonInput() {
    return cy.get('[data-cy="inaccuracy-reason"]');
  }

  inaccuracyReasonLabelText() {
    return cy.get('label[data-cy="inaccuracy-reason-label"]');
  }

  inaccuracyReasonErrorSummary() {
    return cy.get('a[href="#inaccuracy-reason"]');
  }

  inaccuracyReasonErrorMessage() {
    return cy.get('[data-cy="inaccuracy-reason-error"]');
  }

  accurateSubmissionLabel() {
    return cy.get('[data-cy="accurate-submission-label"] legend');
  }

  accurateSubmissionRadioYes() {
    return cy.get('input[data-cy="accurate-submission-yes"]');
  }

  accurateSubmissionRadioNo() {
    return cy.get('input[data-cy="accurate-submission-no"]');
  }

  accurateSubmissionErrorSummary() {
    return cy.get('a[href="#accurate-submission"]');
  }
  accurateSubmissionErrorMessage() {
    return cy.get('[data-cy="accurate-submission-error"]');
  }
}

export default SubmissionAccuracy;
