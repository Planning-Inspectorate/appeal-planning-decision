/// <reference types = "Cypress"/>
module.exports = (errorMessage) => {
  cy.errorMessage().invoke('text')
  .then(text =>{
    expect(text).to.eq(errorMessage);
  })

}
