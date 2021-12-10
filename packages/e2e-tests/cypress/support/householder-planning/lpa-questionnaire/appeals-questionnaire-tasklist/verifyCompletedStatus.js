export const verifyCompletedStatus = (taskName) =>{
  cy.get('li[' + taskName + '-status="COMPLETED"]')
    .find('.govuk-tag').contains('COMPLETED')
}
