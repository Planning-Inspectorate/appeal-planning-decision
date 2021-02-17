module.exports = () => {
  cy.title().should(
    'eq',
    'Do you have any extra conditions? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK'
  )
}
