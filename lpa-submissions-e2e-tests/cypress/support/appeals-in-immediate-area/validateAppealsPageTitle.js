module.exports = () => {
  cy.title().should(
    'eq',
    'Are there any other appeals adjacent or close to the site still being considered? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK'
  )
}
